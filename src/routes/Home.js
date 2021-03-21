import React, { useState, useEffect } from 'react';
import { dbService, storageService } from '../fbase';
import Tweet from '../components/Tweet';
import TweetFactory from 'components/TweetFactory';

const Home = ({ userObj }) => {

    const [tweets, setTweets] = useState([]);
    useEffect(() => {
        // getTweets();
        // 코드 맨 아래에 주석으로 오래된 방식 적어놓음
        // 최신 방식은 아래와 같이 Snapshot을 이용하는 것
        dbService.collection("tweets").onSnapshot((snapShot) => {
            const tweetArr = snapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setTweets(tweetArr);
        })
    }, [])

    return (
        <div>
            <TweetFactory userObj={userObj} />
            <div>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}

export default Home;


// 데이터를 get 하는 방식 중 오래된 방식임.
/*
const getTweets = async () => {
    // dbService.collection("tweets").get() 만 useEffect에 넣어도 되지만
    // 밖에서 따로 함수를 만들어준 이유는 async, await를 사용하기 위해서이다.
    const dbTweets = await dbService.collection("tweets").get();
    // get의 결과 querysnapshat을 반환해준다. 우리가 읽기 불편하니 아래와같이 작성하여 값을 읽는다.
    dbTweets.forEach(document => {
        const tweetObject = {
            ...document.data(),
            id: document.id,
        }
        // set 함수에 값 대신 함수를 전달하면 이전 값에 접근하는 것이 가능하다.
        setTweets(prev => [tweetObject, ...prev]);
    })
}
*/