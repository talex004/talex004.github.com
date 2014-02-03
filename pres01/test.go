package main

import "time"
import "fmt"

type Person struct {
	First, Last string
	Birthday time.Time
}

func main() {
	fmt.Println(Person{"John", "Smith", time.Time{}})
}
