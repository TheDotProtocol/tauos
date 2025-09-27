#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

#define USERNAME "tau"
#define PASSWORD "tauos"

int login_prompt() {
    char user[64], pass[64];
    printf("Tau OS Login:\n");
    printf("Username: ");
    fflush(stdout);
    if (!fgets(user, sizeof(user), stdin)) return 0;
    user[strcspn(user, "\n")] = 0;
    printf("Password: ");
    fflush(stdout);
    if (!fgets(pass, sizeof(pass), stdin)) return 0;
    pass[strcspn(pass, "\n")] = 0;
    if (strcmp(user, USERNAME) == 0 && strcmp(pass, PASSWORD) == 0) {
        return 1;
    }
    printf("Login failed.\n");
    return 0;
}

int main() {
    printf("[sessiond] Tau OS session manager starting\n");
    while (!login_prompt()) {
        // Loop until login success
    }
    printf("Login successful! Launching GUI via sandboxd...\n");
    pid_t pid = fork();
    if (pid == 0) {
        // Launch GUI via sandboxd, passing manifest path
        execl("/core/sandboxd/sandboxd", "sandboxd", "tau-launcher", "/apps/tau-launcher/tau-app.json", NULL);
        perror("execl");
        exit(1);
    } else if (pid > 0) {
        int status;
        waitpid(pid, &status, 0);
        printf("[sessiond] GUI session ended.\n");
    } else {
        perror("fork");
    }
    return 0;
} 