import System.Environment (getArgs)
import Data.List (uncons)

----------------------------------------------------
-- penta(a,0,0,0,0) = (0,b,0,0,0)
--   b = pentation function of a
--
--         2  , 3  , 5  , 7  , 11 
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

----------------------------------------------------
-- mul3(0,x,0) = (0,0,3x)
-- by only inc/dec
mul3 :: (Int ,Int ,Int ) ->     (Int ,Int  ,Int )
mul3    ( 0  , 0  , y  ) =      ( 0  , 0   , y  )
mul3    ( 0  , x  , y  ) = mul3 ( 1  , x-1 , y  )
mul3    ( 1  , x  , y  ) = mul3 ( 2  , x   , y+1)
mul3    ( 2  , x  , y  ) = mul3 ( 3  , x   , y+1)
mul3    ( 3  , x  , y  ) = mul3 ( 0  , x   , y+1)

testmul3 :: Int -> IO ()
testmul3 x = do
  let (a, b, c) = mul3 (0, x, 0)
  print (a, b, c)

----------------------------------------------------
-- mod3(0,x,0) = (0,0,x) if x mod 3 == 0
-- mod3(0,x,0) = (1,0,x) if x mod 3 != 0
-- by only inc/dec
mod3 :: (Int ,Int ,Int ) ->     (Int ,Int  ,Int )
mod3    ( 0  , 0  , y  ) =      ( 0  , 0   , y  )
mod3    ( 2  , 0  , y  ) =      ( 1  , 0   , y  )
mod3    ( 4  , 0  , y  ) =      ( 1  , 0   , y  )
mod3    ( 0  , x  , y  ) = mod3 ( 1  , x-1 , y  )
mod3    ( 1  , x  , y  ) = mod3 ( 2  , x   , y+1)
mod3    ( 2  , x  , y  ) = mod3 ( 3  , x-1 , y  )
mod3    ( 3  , x  , y  ) = mod3 ( 4  , x   , y+1)
mod3    ( 4  , x  , y  ) = mod3 ( 5  , x-1 , y  )
mod3    ( 5  , x  , y  ) = mod3 ( 0  , x   , y+1)

testmod3 :: Int -> IO ()
testmod3 x = do
  let (a, b, c) = mod3 (0, x, 0)
  print (a, b, c)
----------------------------------------------------
main :: IO ()
main = do
  args <- getArgs
  case uncons args of
    Just (xStr, _) -> testmod3(read xStr :: Int)
    Nothing        -> loop                        

loop :: IO ()
loop = do
  putStrLn "Enter a number (or press Ctrl+C to exit):"
  input <- getLine
  let x = read input :: Int
  testmod3 x
  loop
