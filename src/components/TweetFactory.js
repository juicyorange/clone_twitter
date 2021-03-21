import React, { useState } from 'react';
import { storageService, dbService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';

const TweetFactory = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");

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
    )
}

export default TweetFactory