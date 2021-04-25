package installassets

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
)

const (
	installdirname  = ".mw-label-server"
	logosdirname    = "logos"
	contentsdirname = "contents"

	LogoAssetsRoute = "/install/logos/"
)

func installDir() (string, error) {
	h, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("unable to get the current home directory: %w", err)
	}
	return filepath.Join(h, installdirname), nil
}

func LogosDir() (string, error) {
	id, err := installDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(id, logosdirname), nil
}

func contentsDir() (string, error) {
	id, err := installDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(id, contentsdirname), nil
}

func Logos() ([]string, error) {
	logoDir, err := LogosDir()
	if err != nil {
		return nil, err
	}

	files, err := filepath.Glob(logoDir + "/*")
	if err != nil {
		return nil, fmt.Errorf("unable to find logos: %w", err)
	}

	ls := []string{}
	for _, f := range files {
		r, err := filepath.Rel(logoDir, f)
		if err != nil {
			return nil, fmt.Errorf("failed to get relative path from logo directory to logo image %q: %w", f, err)
		}
		ls = append(ls, filepath.Join(LogoAssetsRoute, r))
	}

	return ls, nil
}

func SaveLogo(fn string, file io.Reader) error {
	logoDir, err := LogosDir()
	if err != nil {
		return err
	}

	err = os.MkdirAll(logoDir, os.ModePerm)
	if err != nil {
		return err
	}

	p := filepath.Join(logoDir, fn)

	// Create file
	dst, err := os.Create(p)
	defer dst.Close()
	if err != nil {
		return err
	}

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(dst, file); err != nil {
		return err
	}

	return nil
}

func Contents() ([]Content, error) {
	contentsDir, err := contentsDir()
	if err != nil {
		return nil, err
	}

	files, err := filepath.Glob(contentsDir + "/*.json")
	if err != nil {
		return nil, fmt.Errorf("unable to find logos: %w", err)
	}

	cs := []Content{}
	for _, f := range files {
		fc, err := ioutil.ReadFile(f)
		if err != nil {
			return nil, fmt.Errorf("failed to read %q: %w", f, err)
		}

		var c Content
		if err = json.Unmarshal(fc, &c); err != nil {
			return nil, fmt.Errorf("failed to parse %q: %w", f, err)
		}

		cs = append(cs, c)
	}

	return cs, nil
}

type Content struct {
	ID    string
	Name  string
	Lines []Line
}

type Line struct {
	Text   string
	Weight string
}
