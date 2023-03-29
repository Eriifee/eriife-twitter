import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
let tweets = tweetsData
let tweetsFromLocalStorage = JSON.parse(localStorage.getItem('myTweets'))

if (tweetsFromLocalStorage){
    tweets = tweetsFromLocalStorage
    render()
}


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }

    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.comment){
        handleReplyClick(e.target.dataset.comment)
    }
    else if(e.target.id === 'reply-btn'){
        handleReplyClickBtn(e.target.parentElement.id)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtn()
    }
    else if(e.target.id === 'night'){
        nightmode()
    }
})

function handleLikeClick(tweetId){
    const targetTweetObj = tweets.filter(function(tweet){
           return tweet.uuid === tweetId
    })[0]

    if(targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem('myTweets', JSON.stringify(tweets))
    render()
    
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++ 
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem('myTweets', JSON.stringify(tweets))
    render()
}

function handleTweetBtn(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        tweets.unshift({
            handle: `@eriife`,
        profilePic: `images/eriifeprofilepic.jpg`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
        })
    }
    localStorage.setItem('myTweets', JSON.stringify(tweets))
               render()
               tweetInput.value = ''
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

}

function handleReplyClickBtn(replyId){
               let theUuid = replyId.substring(8)
               let replyInput = document.getElementById(`reply-${theUuid}`)

               const targetTweetObj = tweets.filter(function(tweet){
                   return  tweet.uuid === theUuid
               })[0]

               if(replyInput.value){
                targetTweetObj.replies.unshift({
                    handle: `@eriife`,
                    profilePic: `images/eriifeprofilepic.jpg`,
                    tweetText: replyInput.value,
                })
               }
               localStorage.setItem('myTweets', JSON.stringify(tweets))
               render()
               replyInput.value = ''
               
}
function handleDeleteClick(tweetId){
    const targetTweetObj = tweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

      tweets.splice(tweets.indexOf(targetTweetObj), 1)
      localStorage.setItem('myTweet', JSON.stringify(tweets))
      render()
}

function nightmode(){
         document.querySelector('.main').classList.toggle('night')
         document.querySelector('.tweet-btn').classList.toggle('night-inverse')
         document.querySelector('.reply-btn').classList.toggle('night-inverse')
         document.querySelector('.textarea').classList.toggle('night')
         document.querySelector('.reply-input').classList.toggle('night')
 
}


function getFeedHtml(){
    let feedHtml = ``
    tweets.forEach(function(tweet){

        let replyHtml = ``

        if(tweet.replies.length>0){
            tweet.replies.forEach(function(reply){
                replyHtml += 
                `<div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
            </div>
                `
            })
        }
        let likeIconClass = ''
            if(tweet.isLiked){
                likeIconClass = 'liked'
            }

        let retweetIconClass = ''
        
            if(tweet.isRetweeted){
                retweetIconClass = 'retweeted'
            }
            feedHtml +=
             `<div class="tweet">
             <div class="tweet-inner">
                 <img src="${tweet.profilePic}" class="profile-pic">
                 <div>
                     <p class="handle">${tweet.handle}</p>
                     <p class="tweet-text">${tweet.tweetText}</p>
                     <div class="tweet-details">
                         <span class="tweet-detail">
                         <i class="fa-solid fa-comment-dots" data-comment="${tweet.uuid}"></i>
                             ${tweet.replies.length}
                             
                         </span>
                         <span class="tweet-detail">
                         <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                             ${tweet.likes}
                         </span>
                         <span class="tweet-detail">
                         <i class="fa-sharp fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                             ${tweet.retweets}
                         </span>
                         <span class="tweet-detail">
                         <i class="fa-sharp fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                         </span>
                     </div>   
                 </div>   
             </div>
             <div class="hidden" id="replies-${tweet.uuid}">
             <div class="reply-input-area">
             <img src="images/eriifeprofilepic.jpg" class="profile-pic">
             <textarea placeholder="Reply tweet?" id='reply-${tweet.uuid}' class="reply-input"></textarea>
         </div>
         <button id="reply-btn">Reply</button>
                   ${replyHtml}
                 </div>            
    </div>
            `
    })

    return feedHtml
}

function render(){

    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()