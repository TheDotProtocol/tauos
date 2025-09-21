#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/mount.h>
#include <sys/types.h>
#include <signal.h>
#include <errno.h>

void mount_fs(const char *src, const char *target, const char *type, unsigned long flags) {
    if (mount(src, target, type, flags, "") == -1) {
        perror("mount");
    } else {
        printf("[init] Mounted %s on %s\n", type, target);
    }
}

void spawn(const char *path) {
    pid_t pid = fork();
    if (pid == 0) {
        execl(path, path, NULL);
        perror("execl");
        exit(1);
    } else if (pid > 0) {
        printf("[init] Spawned %s (pid %d)\n", path, pid);
    } else {
        perror("fork");
    }
}

int main() {
    printf("[init] Tau OS init starting (PID 1)\n");
    mount_fs("proc", "/proc", "proc", 0);
    mount_fs("sysfs", "/sys", "sysfs", 0);
    mount_fs("devtmpfs", "/dev", "devtmpfs", 0);

    spawn("/core/netd");
    spawn("/core/sessiond");

    // Reap zombies
    while (1) {
        int status;
        pid_t pid = waitpid(-1, &status, 0);
        if (pid > 0) {
            printf("[init] Reaped child %d\n", pid);
        } else if (pid == -1 && errno == ECHILD) {
            sleep(1);
        }
    }
    return 0;
} 