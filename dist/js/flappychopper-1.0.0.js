$(function(){
   $screen=$('.playScreen');
   $chopper=$('.chopper');
   var fallTime=1500,
       gameState= 2, //scoreScreen
       gapHeight=150, //change height, make it harder or easier mode
       pipeId=0;

   //setInterval
   var int=setInterval(function(){
      if(gameState ===1){
         addPipe();
         movePipes();
      }
   }, 1300);

   //every 10ms check chopperStatus
   var chopperInt=setInterval(function(){
      if(gameState ===1){
         chopperStatus();
      }
   },10);

   //mousedown on gamescreen
   $screen.mousedown(function(){
         chopperFlap();
       if(gameState === 2){
         gameState = 1;
         deleteInterval();
       }
      });

   //space keydown on gamescreen
   $(window).keydown(function(e){
      if(e.keyCode === 32){
         chopperFlap();
      e.preventDefault();
      if(gameState === 2){
        gameState = 1;
        deleteInterval();
      }
      }
   });

   function deleteInterval(){
    setTimeout(function(){
      var int= setInterval(function(){ 
        if(gameState === 1){
          deletePipe();
        }
      }, 1300);
    }, 2050);
  }
   //chopperFlap(),0.2秒上去60px, 检测是否撞墙，
   //再接着0.3秒下来60px，检测是否撞墙,
   function chopperFlap(){
     if(gameState === 1 || gameState === 2){
      $chopper.css('transform', 'rotate(-20deg)');
      $chopper.stop().animate({
         bottom: '+=60px'
      }, 200, function(){
        chopperStatus();
        $chopper.css('transform', 'rotate(0deg)');
         $chopper.stop().animate({
             bottom: '-=60px'
        }, 300, 'linear', function(){
          chopperStatus();
          falling();
        });
      });
    }
   }

   function falling(){
      percent = parseInt($chopper.css('bottom')) / $screen.height();
      totalFallTime = fallTime * percent;
      $chopper.stop().animate({
         bottom: '0'
      }, totalFallTime, 'linear');
      //是否是下降的同时转90度落地
      $chopper.css('transform', 'rotate(90deg)');
   }

   //check if hit pipe or screen top/bottom
   function chopperStatus(){
      if(parseInt($chopper.css('bottom'))===0 || parseInt($chopper.css('top'))===0){
         gameOver();
      }
      //check if hit the pipe,currentPipe.width都可改为数字,currentPipe.offset().top + pipeTop.height()才是显示的长度,nth-of-type(4)即排除前两根，以及第一根吗？
      currentPipe=$('.pipe:nth-of-type(4)');
      if(currentPipe.length){
         pipeTop=$('.pipe:nth-of-type(4) .topHalf');
         pipeBottom=$('.pipe:nth-of-type(4) .bottomHalf');
         if(($chopper.offset().left + $chopper.width()) >= currentPipe.offset().left && $chopper.offset().left <= (currentPipe.offset().left + 60)){
        if($chopper.offset().top < (currentPipe.offset().top + pipeTop.height()) || ($chopper.offset().top + $chopper.height()) > ((currentPipe.offset().top + pipeTop.height()) + gapHeight)){
          gameOver();
        }
      } else if($chopper.offset().left >= (currentPipe.offset().left + 60)){
        $('.score').text(currentPipe.attr('pipe-id'));
      }

      }
   }

   //addPipe()
   function addPipe(){
      pipeId++;
      //vary between 150-300,may change it use sin/cos?
      topHeight = Math.floor(Math.random() * 150) + 150;
      bottomHeight = $screen.height() - (topHeight + gapHeight);
      pipe = '<div class="pipe" pipe-id="' + pipeId + '"><div style="height: ' + topHeight + 'px" class="topHalf"></div> <div style="height:' + bottomHeight + 'px" class="bottomHalf"></div></div>';
      $screen.append(pipe);
   }

   //movePipe(), linear fall not free fall
   function movePipes(){
      $('.pipe').each(function(){
         $(this).animate({
            right: '+=160px'
         }, 1300, 'linear');
      });
   }
   //deletePipe()
   function deletePipe(){
      $('.pipe').first().remove();
   }
   //gameOver() =>state 2
   function gameOver(){
      clearInterval(chopperInt);
      $('.pipe').stop();
      falling();
      gameState = 0;
   }
});