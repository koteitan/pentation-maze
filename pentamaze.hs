import System.Environment (getArgs)
import Data.List (uncons)
import Debug.Trace (trace)
----------------------------------------------------
-- penta2(a,0,0,0,0,0) = (0,b,0,0,0,0)
--   b = pentation function of a
--
--        2^a  3^b  5^c  7^d  11^e   f             2^a  3^b  5^c  7^d  11^e  f
penta2:: (Int ,Int ,Int ,Int ,Int ,Int ) ->       (Int ,Int ,Int ,Int ,Int ,Int ) --  penta(x) =
penta2   ( 0  , b  , 0  , _  , _  ,  _ ) =        ( 0  , b  , 0  , 0  , 0  ,  1 ) -- 0:       x            if x%2 && x% 5        
penta2   ( a  , 0  , 0  , _  , _  ,  1 ) = penta2_( a-1, 2  , 0  , 0  , 0  ,  1 ) -- 1: penta(x*   9/   2) if x%3 && x% 5 && x%13
penta2   ( a  , b  , 0  , 0  , _  ,  1 ) = penta2_( a  , b-1, 2  , 0  , 0  ,  1 ) -- 2: penta(x*  25/   3) if x%5 && x% 7 && x%13
penta2   ( a  , 0  , c  , _  , _  ,  1 ) = penta2_( a-1, 0  , c  , 0  , 0  , 13 ) -- 3: penta(x*  13/   2) if x%3         && x%13
penta2   ( a  , b  , c  , 0  , 0  ,  1 ) = penta2_( a  , b  , c-1, 2  , 0  ,  1 ) -- 4: penta(x*  49/   5) if x%7 && x%11 && x%13
penta2   ( a  , b  , 0  , d  , _  ,  1 ) = penta2_( a  , b-1, 0  , d  , 0  , 17 ) -- 5: penta(x*  17/   3) if x%5         && x%13
penta2   ( a  , b  , c  , 0  , e  ,  1 ) = penta2_( a  , b  , c-1, 0  , e  , 19 ) -- 6: penta(x*  19/   5) if x%7         && x%13
penta2   ( a  , b  , c  , d  , e  ,  1 ) = penta2_( a  , b  , c  , d-1, e+2,  1 ) -- 7: penta(x* 121/   7) if                x%13
penta2   ( a  , b  , 0  , _  , _  , 13 ) = penta2_( a  , b  , 0  , 0  , 0  ,  1 ) -- 8: penta(x*   1/  13) if        x% 5 && x%13
penta2   ( a  , b  , c  , _  , _  , 13 ) = penta2_( a  , b+1, c-1, 0  , 0  , 13 ) -- 9: penta(x*   3/   5) if                x%13
penta2   ( a  , b  , c  , 0  , _  , 17 ) = penta2_( a  , b  , c  , 0  , 0  ,  1 ) --10: penta(x*   1/  17) if        x% 7 && x%17
penta2   ( a  , b  , c  , d  , _  , 17 ) = penta2_( a  , b  , c+1, d-1, 0  , 17 ) --11: penta(x*   5/   7) if                x%17
penta2   ( a  , b  , c  , d  , 0  ,  _ ) = penta2_( a  , b  , c  , d  , 0  ,  1 ) --12: penta(x*   1/  19) if        x%11 && x%19
penta2   ( a  , b  , c  , d  , e  ,  _ ) = penta2_( a  , b  , c  , d+1, e-1, 19 ) --13: penta(x*   7/  11) otherwise

penta2_ :: (Int, Int, Int, Int, Int, Int) -> (Int, Int, Int, Int, Int, Int)
--penta2_ args = trace ("penta2" ++ show args) (penta2 args)
penta2_ args = (penta2 args)

testpenta2 :: Int -> IO ()
testpenta2 x = do
  let (a, b, c, d, e, f) = penta2(x, 0, 0, 0, 0, 1)
  print (a, b, c, d, e, f)
----------------------------------------------------
-- penta(a,0,0,0,0) = (0,b,0,0,0)
--   b = pentation function of a
--
--        2^a  3^b  5^c  7^d  11^e           
penta :: (Int ,Int ,Int ,Int ,Int ) ->      (Int ,Int ,Int ,Int ,Int )
penta    ( 0  , b  , _  , _  , _  ) =       ( 0  , b  , 0  , 0  , 0  ) -- if      x mod  2!=0 then end
penta    ( a  , 0  , 0  , _  , _  ) = penta ( a-1, 2  , 0  , 0  , 0  ) -- else if x mod 15!=0 then penta(x*(  9/2)
penta    ( a  , b  , 0  , 0  , _  ) = penta ( a  , b-1, 2  , 0  , 0  ) -- else if x mod 35!=0 then penta(x*( 25/3)
penta    ( a  , 0  , c  , _  , _  ) = penta ( a-1, c  , 0  , 0  , 0  ) -- else if x mod  3!=0 then penta(x*(  1/2)*(  3/5)^c
penta    ( a  , b  , c  , 0  , 0  ) = penta ( a  , b  , c-1, 2  , 0  ) -- else if x mod 77!=0 then penta(x*( 49/5)
penta    ( a  , b  , 0  , d  , _  ) = penta ( a  , b-1, d  , 0  , 0  ) -- else if x mod  5!=0 then penta(x*(  1/3)*(  5/7)^d
penta    ( a  , b  , c  , 0  , e  ) = penta ( a  , b  , c-1, e  , 0  ) -- else if x mod  7!=0 then penta(x*(  1/5)*( 7/11)^e
penta    ( a  , b  , c  , d  , e  ) = penta ( a  , b  , c  , d-1, e+2) -- else                     penta(x*(121/7)

testpenta :: Int -> IO ()
testpenta x = do
  let (a, b, c, d, e) = penta(x, 0, 0, 0, 0)
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
    Just (xStr, _) -> testpenta2(read xStr :: Int)
    Nothing        -> loop                        

loop :: IO ()
loop = do
  putStrLn "Enter a number (or press Ctrl+C to exit):"
  input <- getLine
  let x = read input :: Int
  testpenta x
  loop
