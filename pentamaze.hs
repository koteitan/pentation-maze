import System.Environment (getArgs)
import Data.List (uncons)

penta :: (Int ,Int ,Int ,Int ,Int ) ->      (Int ,Int ,Int ,Int ,Int )
penta    ( 0  , b  , c  , d  , e  ) =       ( 0  , b  , c  , d  , e  )
penta    ( a  , 0  , 0  , 0  , 0  ) = penta ( a-1, 2  , 0  , 0  , 0  )
penta    ( a  , b  , 0  , 0  , 0  ) = penta ( a  , b-1, 2  , 0  , 0  )
penta    ( a  , 0  , c  , 0  , 0  ) = penta ( a-1, c  , 0  , 0  , 0  )
penta    ( a  , b  , c  , 0  , 0  ) = penta ( a  , b  , c-1, 2  , 0  )
penta    ( a  , b  , 0  , d  , 0  ) = penta ( a  , b-1, d  , 0  , 0  )
penta    ( a  , b  , c  , 0  , e  ) = penta ( a  , b  , c-1, e  , 0  )
penta    ( a  , b  , c  , d  , e  ) = penta ( a  , b  , c  , d-1, e+2)

testpenta :: Int -> IO ()
testpenta x = do
  let (a, b, c, d, e) = penta (x, 0, 0, 0, 0)
  print (a, b, c, d, e)

main :: IO ()
main = do
  args <- getArgs
  case uncons args of
    Just (xStr, _) -> testpenta (read xStr :: Int)
    Nothing        -> loop                        

loop :: IO ()
loop = do
  putStrLn "Enter a number (or press Ctrl+C to exit):"
  input <- getLine
  let x = read input :: Int
  testpenta x
  loop
