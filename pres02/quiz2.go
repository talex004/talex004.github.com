package main

import "fmt"

type Person struct {
	First, Last string
	Age int
}

// START OMIT
func NewPerson(first, last string) *Person {
	return &Person{first, last, 20}
}

func (p *Person) GetsOlder() {
	p.Age++
}

func main() {
	jane := NewPerson("Jane", "Doe")
	jane.GetsOlder()
	fmt.Println(jane.Age)
}
// END OMIT
