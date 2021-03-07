import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from '../fbase';
import Tweet from '../components/Tweet';

const Home = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");
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
    useEffect(() => {
        // getTweets();
        // 최신 방식은 아래와 같이 Snapshot을 이용하는 것
        dbService.collection("tweets").onSnapshot((snapShot) => {
            const tweetArr = snapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setTweets(tweetArr);
        })
    }, [])

    // 이미지 파일을 업로드하고 그 뒤에 이미지 url 에 tweet을 추가하는 방식으로 작업할 것
    const onSubmit = async (e) => {
        e.preventDefault();

        let attachmentUrl = "";

        // 유저 아이디 기반으로 폴더/파일 을 생성하고 ref를 받아옴.
        // 이후 ref를 이용해 파일을 참조하여 다른 정보들을 넣는다
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url")
            attachmentUrl = await response.ref.getDownloadURL();
        }

        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }

        //프로미스를 반환하기 때문에 async 와 await를 해준다
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    }
    const onChange = (e) => {
        const { target: { value } } = e;
        setTweet(value);
    }
    const onFileChange = (e) => {
        const { target: { files } } = e;
        const theFile = files[0];
        // 파일을 읽기 위해 fileReader API 사용
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => {
        setAttachment(null);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={tweet} type="text" placeholder="무슨 생각을 하고 있습니까? " maxLength={100} />
                <input type="file" aceept="image/*" onChange={onFileChange} />
                <input type="Submit" defaultValue="Tweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}

export default Home;