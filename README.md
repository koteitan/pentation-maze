# pentation maze
Test of the pentation function in Haskell.

## requirements
```bash
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
sudo apt install libgmp-dev
ghcup install ghc 9.12.1
ghcup install cabal 3.14.1.0
ghcup install stack 3.3.1
```

## pentamaze.hs
```bash
stack runghc testpenta.hs 3
(0,65536,0,0,0)
```
or
```bash
stack runghc pentamaze.hs
Enter a number (or press Ctrl+C to exit):
3
(0,65536,0,0,0)
Enter a number (or press Ctrl+C to exit):
^C
```

## testpenta
Calculates the pentation of a number.

