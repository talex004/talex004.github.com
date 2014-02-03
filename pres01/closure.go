package main

import "fmt"

func main() {
//START OMIT
	i := 0
	next := func() int {
		i++
		return i
	}
	fmt.Println(next(), next(), next())
//END OMIT
}
