CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -O2 -g
LDFLAGS = -ljson-c -lgtk-3 -ldbus-1 -lflatpak -lpthread

TARGET = flatpakd
SOURCES = flatpakd.c
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
	install -D -m 644 flatpakd.service /etc/systemd/system/flatpakd.service
	systemctl daemon-reload
	systemctl enable flatpakd.service

uninstall:
	rm -f /usr/bin/$(TARGET)
	rm -f /etc/systemd/system/flatpakd.service
	systemctl daemon-reload 