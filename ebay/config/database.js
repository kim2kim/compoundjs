module.exports =   
 { "development":  
  { "driver":  "mysql"  
  , "host" : "127.0.0.1"  
  , "username": "root"  
  , "password": "root"  
  , "database": "compound_test"  
  }  
  ,  
  "production":  
  { "driver":  "mysql"  
  , "host" : "127.0.0.1"  
  , "username": "root"  
  , "password": ""  
  , "database": "compound_test"  
  }  
  , "test":
    { "driver":   "memory"
    }
 }; 

