CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -O2 -g
LDFLAGS = -lgtk-4 -ltauos -lgobject-2.0 -lglib-2.0

TARGET = tau-c-app
SOURCES = main.c
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

uninstall:
	rm -f /usr/bin/$(TARGET)

run: $(TARGET)
	./$(TARGET) 