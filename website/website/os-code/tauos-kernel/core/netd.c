#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <string.h>
#include <errno.h>

int iface_exists(const char *iface) {
    char path[64];
    snprintf(path, sizeof(path), "/sys/class/net/%s", iface);
    return access(path, F_OK) == 0;
}

void run_udhcpc(const char *iface) {
    pid_t pid = fork();
    if (pid == 0) {
        execlp("udhcpc", "udhcpc", "-i", iface, NULL);
        perror("udhcpc");
        exit(1);
    } else if (pid > 0) {
        printf("[netd] Started udhcpc for %s (pid %d)\n", iface, pid);
    } else {
        perror("fork");
    }
}

int main() {
    printf("[netd] Tau OS netd starting\n");
    if (iface_exists("eth0")) {
        printf("[netd] eth0 detected\n");
        run_udhcpc("eth0");
    }
    if (iface_exists("wlan0")) {
        printf("[netd] wlan0 detected\n");
        run_udhcpc("wlan0");
    }
    // Wait for children
    while (1) {
        int status;
        pid_t pid = waitpid(-1, &status, 0);
        if (pid > 0) {
            printf("[netd] Reaped child %d\n", pid);
        } else if (pid == -1 && errno == ECHILD) {
            sleep(1);
        }
    }
    return 0;
} 