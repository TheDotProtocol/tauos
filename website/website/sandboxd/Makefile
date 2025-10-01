CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -O2 -g
LDFLAGS = -ljson-c -lapparmor -lselinux -lgtk-3 -lpthread

TARGET = sandboxd
SOURCES = sandboxd.c
OBJECTS = $(SOURCES:.c=.o)

.PHONY: all clean install

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $(OBJECTS) -o $(TARGET) $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

install: $(TARGET)
	install -D -m 755 $(TARGET) /usr/bin/$(TARGET)
	install -D -m 644 sandboxd.service /etc/systemd/system/sandboxd.service
	systemctl daemon-reload
	systemctl enable sandboxd.service

uninstall:
	rm -f /usr/bin/$(TARGET)
	rm -f /etc/systemd/system/sandboxd.service
	systemctl daemon-reload 