package main
import "sync"
import "fmt"
import "time"

// START OMIT
var once sync.Once
func initialize() {
	once.Do(func() {
		fmt.Println("Initializing")
	})
}
func main() {
	fmt.Println("Starting")
	for i:=0; i<5; i++ {
		go func(i int) {
			initialize()
			fmt.Println("Thread", i, "working")
		}(i)
	}
	time.Sleep(1* time.Second) 
}
//END OMIT
