import React, { useState } from "react";
import { dbService, storageService } from '../fbase';

const Tweet = ({ tweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("정말 삭제하시겠습니까?");
        if (ok) {
            // tweet 삭제
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
            await storageService.refFromURL(tweetObj.attachmentUrl).delete();
        }
    }

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text: newTweet
        });
        setEditing(false);
    }

    const onChange = (e) => {
        const { target: { value } } = e;
        setNewTweet(value);
    }
    return (
        <div>
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit}>
                                <input onChange={onChange} type="text" placeholder="Editing..." value={newTweet} required />
                                <input type="submit" value="Update" />
                            </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </>
                    )}
                </>
            ) : (
                    <>
                        <h4>{tweetObj.text}</h4>
                        {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} width="50px" height="50px" />}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Tweet</button>
                                <button onClick={toggleEditing}>Edit Tweet</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    )
}

export default Tweet;