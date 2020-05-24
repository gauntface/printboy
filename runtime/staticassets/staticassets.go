package staticassets

import (
	"fmt"
	"path/filepath"

	"github.com/markbates/pkger"
)

func Init() (string, error) {
	if err := pkger.MkdirAll("/static", 0766); err != nil {
		return "", fmt.Errorf("failed to make static directory: %w", err)
	}

	i, err := pkger.Current()
	if err != nil {
		return "", fmt.Errorf("Unable to get info: %w", err)
	}

	fmt.Printf("📂 pkger info: %+v\n", i)

	return filepath.Join(i.Dir, "static"), nil
}
