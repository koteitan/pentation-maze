import System.Environment (getArgs)
import Data.List (uncons)

----------------------------------------------------
-- penta(a,0,0,0,0) = (0,b,0,0,0)
--   b = pentation function of a
--
--        2^a  3^b  5^c  7^d  11^e           
penta :: (Int ,Int ,Int ,Int ,Int ) ->      (Int ,Int ,Int ,Int ,Int )
penta    ( 0  , b  , _  , _  , _  ) =       ( 0  , b  , 0  , 0  , 0  ) -- if      x mod  2!=0 then end
penta    ( a  , 0  , 0  , _  , _  ) = penta ( a-1, 2  , 0  , 0  , 0  ) -- else if x mod 15!=0 then x <- x*(  9/2)
penta    ( a  , b  , 0  , 0  , _  ) = penta ( a  , b-1, 2  , 0  , 0  ) -- else if x mod 35!=0 then x <- x*( 25/3)
penta    ( a  , 0  , c  , _  , _  ) = penta ( a-1, c  , 0  , 0  , 0  ) -- else if x mod  3!=0 then x <- x*(  1/2)*(  3/5)^c
penta    ( a  , b  , c  , 0  , 0  ) = penta ( a  , b  , c-1, 2  , 0  ) -- else if x mod 77!=0 then x <- x*( 49/5)
penta    ( a  , b  , 0  , d  , _  ) = penta ( a  , b-1, d  , 0  , 0  ) -- else if x mod  5!=0 then x <- x*(  1/3)*(  5/7)^d
penta    ( a  , b  , c  , 0  , e  ) = penta ( a  , b  , c-1, e  , 0  ) -- else if x mod  7!=0 then x <- x*(  1/5)*( 7/11)^e
penta    ( a  , b  , c  , d  , e  ) = penta ( a  , b  , c  , d-1, e+2) -- else                     x <- x*(121/7)

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
-- div3(0,3x,0) = (0,0,x)
-- by only inc/dec
div3 :: (Int ,Int ,Int ) ->     (Int ,Int  ,Int )
div3    ( 0  , 0  , y  ) =      ( 0  , 0   , y  )
div3    ( 0  , x  , y  ) = div3 ( 1  , x   , y+1)
div3    ( 1  , x  , y  ) = div3 ( 2  , x-1 , y  )
div3    ( 2  , x  , y  ) = div3 ( 3  , x-1 , y  )
div3    ( 3  , x  , y  ) = div3 ( 0  , x-1 , y  )

testdiv3 :: Int -> IO ()
testdiv3 x = do
  let (a, b, c) = div3 (0, x, 0)
  print (a, b, c)
----------------------------------------------------

main :: IO ()
main = do
  args <- getArgs
  case uncons args of
    Just (xStr, _) -> testpenta(read xStr :: Int)
    Nothing        -> loop                        

loop :: IO ()
loop = do
  putStrLn "Enter a number (or press Ctrl+C to exit):"
  input <- getLine
  let x = read input :: Int
  testpenta x
  loop
