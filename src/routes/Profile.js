import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { authService, dbService, storageService } from 'fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({ refreshUser, userObj }) => {
    // 유저의 닉네임을 관리하기 위한 state
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [profAttachment, setProfAttachment] = useState("");
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    // 내가 작성한 트윗들을 가져오는 함수
    const getMyTweets = async () => {
        const myTweets = await dbService
            .collection("tweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
        // console.log(myTweets.docs.map(doc => doc.data()));
    }

    // 나의 프로필 이미지를 가져오는 함수
    // const getMyPhoto = async () => {
    //     tweetObj.profAttachment
    // }

    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setNewDisplayName(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        let profAttachmentUrl = "";

        if (userObj.photoURL !== profAttachment) {
            const profattachmentRef = storageService.ref().child(`profphoto/${userObj.uid}/${uuidv4()}`);
            const response = await profattachmentRef.putString(profAttachment, "data_url");
            profAttachmentUrl = await response.ref.getDownloadURL();

            if (userObj.photoURL !== profAttachmentUrl) {
                console.log(profAttachmentUrl);
                console.log(userObj.photoURL);
                if (userObj.photoURL) { await storageService.refFromURL(userObj.photoURL).delete(); }
                await userObj.updateProfile({
                    photoURL: profAttachmentUrl,
                })
            }
            // url을 저장했기 때문에 다시 빈 스트링으로 만들어준다
            setProfAttachment("");
            refreshUser();
        }

        if (userObj.displayName !== newDisplayName) {
            // firebase userObj 에서 제공하는 것은 photoUrl 과 displayName
            // 뿐으로 많은 정보를 담을 수 없다. 이것을 firebase에서 해결하려면 firestore에 user를 위한 콜렉션을
            // 만들어서 거기에 유저에 대한 정보를 담으면 된다. 
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    }

    const onFileChange = (e) => {
        const { target: { files } } = e;
        const theFile = files[0];
        // 파일을 읽기 위해 fileReader API 사용
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setProfAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearProfAttachment = () => {
        setProfAttachment(null);
    }

    useEffect(() => {
        getMyTweets();
    }, [])
    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="닉네임" value={newDisplayName} />
                <input type="file" aceept="image/*" onChange={onFileChange} />
                <input type="Submit" defaultValue="Tweet" />
                {profAttachment && (
                    <div>
                        <img src={profAttachment} width="50px" height="50px" />
                        <button onClick={onClearProfAttachment}>Clear</button>
                    </div>
                )}
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}

export default Profile;