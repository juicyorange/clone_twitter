import React, { useState } from 'react';
import { authService, firebaseInstance } from 'fbase';

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, SetNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (e) => {
        // e(event)는 일어난 사건을 의미한다.(여기서는 input 태그의 값이 바뀐 것)
        // 그리고 e의 정보중 하나인 target 에는 변경이 일어난 부분에 대한 자세한 정보들이 들어가있다.
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (e) => {
        // submit을 하면 새로고침이 된다.
        // 이때 preventDefault()를 이용해 새로고침이 되는 것을 방지해준다.
        // 새로고침이 되면 React 관련 코드들이 다시 로드되는 것이기 때문에 state와 같은 것들이 모두 사라지기 때문이다.
        e.preventDefault();
        try {
            let data;
            if (newAccount) {
                // newAccount가 true인 경우 새 계정을 만든다
                // promise를 받으면 await를 사용해야한다.
                data = await authService.createUserWithEmailAndPassword(email, password)
            } else {
                // false 인 경우 로그인 작업을 진행한다.
                data = await authService.signInWithEmailAndPassword(email, password)
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }

    };
    const toggleAccqount = () => {
        SetNewAccount(prev => !prev);
    }
    const onSocialClick = async (e) => {
        const { target: { name } } = e;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name = "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="password" required value={password} onChange={onChange} />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
            </form>
            <span onClick={toggleAccqount}>{newAccount ? "Sign In" : "Create Account"}</span>
            {error}
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth;