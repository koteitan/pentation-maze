import Debug.Trace (trace)
main :: IO ()
main = do
  testpenta

testpenta = do
  print "x=?"
  x <- readLn :: IO Int;
  let (a,b,c,d,e) = penta(x,0,0,0,0)
  print (a,b,c,d,e)
  testpenta

penta :: (Int ,Int ,Int ,Int ,Int ) ->      (Int ,Int ,Int ,Int ,Int )
penta    ( 0  , b  , c  , d  , e  ) =       ( 0  , b  , c  , d  , e  )
penta    ( a  , 0  , 0  , 0  , 0  ) = penta ( a-1, 2  , 0  , 0  , 0  )
penta    ( a  , b  , 0  , 0  , 0  ) = penta ( a  , b-1, 2  , 0  , 0  )
penta    ( a  , 0  , c  , 0  , 0  ) = penta ( a-1, c  , 0  , 0  , 0  )
penta    ( a  , b  , c  , 0  , 0  ) = penta ( a  , b  , c-1, 2  , 0  )
penta    ( a  , b  , 0  , d  , 0  ) = penta ( a  , b-1, d  , 0  , 0  )
penta    ( a  , b  , c  , 0  , e  ) = penta ( a  , b  , c-1, e  , 0  )
penta    ( a  , b  , c  , d  , e  ) = penta ( a  , b  , c  , d-1, e+2)

