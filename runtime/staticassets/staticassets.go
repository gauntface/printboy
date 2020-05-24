package staticassets

import (
	"fmt"

	"github.com/markbates/pkger"
)

func New() error {
	info, err := pkger.Stat("/static/index.html")
	if err != nil {
		return err
	}
	fmt.Println("Name: ", info.Name())
	fmt.Println("Size: ", info.Size())
	fmt.Println("Mode: ", info.Mode())
	fmt.Println("ModTime: ", info.ModTime())
	return nil
}
