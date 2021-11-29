package main

import ( 
    "fmt"
    "strings"
    ipfs "github.com/ipfs/go-ipfs-api"
)

func main() {
    sh := ipfs.NewShell("https://ipfs.infura.io:5001")
    cid, err := sh.Add(strings.NewReader("hello world!"))
    if err != nil {
        panic(err)
    }
    fmt.Printf("https://gateway.ipfs.io/ipfs/%s\n", cid) 
}
