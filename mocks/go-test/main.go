package main

import (
	"log"
	"time"

	"github.com/yaacov/observer/observer"
)

func main() {
	// Open an observer and start watching for file modifications
	o := observer.Observer{}
	err := o.Watch([]string{"./watch.txt"})
	if err != nil {
		log.Fatal("Error: ", err)
	}
	//close once this funtion finishes execution
	defer o.Close()

	// Add a listener that logs events
	o.AddListener(func(e interface{}) {
		//do whatever
		//e.(observer.WatchEvent) == CREATE
		log.Printf("File modified: %v.\n", e.(observer.WatchEvent))
	})

	// Wait 10s for changes in file
	log.Print("Observer is watching ./watch.txt ")
	time.Sleep(12 * time.Second)
}
