module.exports = function(app,db,compare) {


  app.get('/',function(req,res){
    res.sendFile(__dirname+'/client/build/index.html')
  })


  app.get('/api/classlist', function(req, res){
    db.query("SELECT DISTINCT class FROM precourse.Students;",function(err,resp){
      if(err){
        res.send(err)
      }
      res.send(resp.map(e=>e.class).join(" "))
    })
  })


  app.get('/api/bashclassnames', function(req, res){
    db.query("SELECT DISTINCT GithubName FROM precourse.Students WHERE class='"+req.query.c+"';",function(err,resp){
      console.log(resp)
      if(err){
        res.send(err)
      }
      res.send(resp.map(e=>e.GithubName).join(" "))
    })
  })


  app.get('/api/cohorts', function(req, res){
    db.query("SELECT DISTINCT Class FROM precourse.Students WHERE Class LIKE '"+req.query.c+"%';",function(err,resp){
      console.log(resp)
      if(err){
        res.send(err)
      }
      var c = resp.map(e=>e.Class)
      c = c.sort(compare)
      res.send(c)
    })
  })


  app.get('/api/class', function(req, res){
    console.log(req.query.c)
    if(req.query.c === "all"){
      db.query("SELECT * FROM precourse.Students;",function(err,resp){
        if(err){
          res.send(err)
        }
        console.log(resp)
        res.send(resp)
      })
    } else {
      db.query("SELECT * FROM precourse.Students WHERE class='"+req.query.c+"';",function(err,resp){
        if(err){
          res.send(err)
        }
          res.send(resp.map(function(el){
            if(el.Koans > 50){
              el.KoansColor = "green"
            }else if(el.Koans < 25){
              el.KoansColor = "red"
            }else{
              el.KoansColor = "yellow"
            }

            if(el.UnderbarOne > 120){
              el.UnderbarColor = "green"
            }else if(el.UnderbarOne < 60){
              el.UnderbarColor = "red"
            }else{
              el.UnderbarColor = "yellow"
            }

            if(el.Recursion >= 2){
              el.RecursionColor = "green"
            }else if(el.Recursion <= 1){
              el.RecursionColor = "red"
            }else{
              el.RecursionColor = "yellow"
            }

            if(el.Testbuilder >= 3000){
              el.TestbuilderColor = "green"
            }else if(el.Testbuilder <= 300){
              el.TestbuilderColor = "red"
            }else{
              el.TestbuilderColor = "yellow"
            }
            return el
          }));
      })
    }
  })


  app.post('/api/addclass',function(req, res){
    //console.log(req.body)
    var r = req.body
    r.names.forEach(function(e,i){
      console.log(e)
      db
      .query("INSERT INTO precourse.Students (`FullName`,`GithubName`,`Class`) VALUES ('"+e+"','"+r.handles[i]+"','"+r.class+"');",function(){
        if(i === r.names.length - 1){
	  res.send("done")
	}
      })

       })
  })

  app.post('/api/updatebyhandle', function(req, res){
    var r = JSON.parse(req.body.data);
    r.forEach(function(e,i){
      //"id":2,"FullName":"Aaron Valdez","GithubName":"A-A-RonV","Class":"SSP8","UnderbarOne":"100","UnderbarTwo":null,"Testbuilder":null,"Koans":"54","Recursion":null
      db.query("UPDATE precourse.Students SET Koans = "+e.Koans+", UnderbarOne = "+e.UnderbarOne+", Recursion = "+e.Recursion+", Testbuilder = "+e.Testbuilder+" WHERE id ="+e.id+";",function(err){
        if(err){
          console.log(err)
        } else {
          console.log(i+1 + " of " + r.length)
        }
      });

    })
    res.send("all good")
    })
}
