import { useState } from "react";
import { signInAuthUserWithEmailAndPassword, signInWithGooglePopup, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";
import Button from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import './sign-in-form.styles.scss'

const defaultCredentials = {
    email: '',
    password: ''
}

const SignInForm = () => {
    const [credentials, setCredentials] = useState(defaultCredentials);
    const { email, password } = credentials;

    const signInWithGoogle = async () => {
        const response = await signInWithGooglePopup();
        await createUserDocumentFromAuth(response.user);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { user } = await signInAuthUserWithEmailAndPassword(email, password);
            console.log(user);
            resetCredentials();
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    alert("Email and password don't match");
                    break;
                case 'auth/user-not-found':
                    alert("No user associated with this email");
                    break;
                default:
                    console.error(error);
                    break;
            }
        }
    }

    const resetCredentials = () => {
        setCredentials(defaultCredentials);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    }

    return (
        <div className="sign-in-container">
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="email"
                    type="email"
                    required
                    onChange={handleChange}
                    name="email"
                    value={email}>
                </FormInput>
                <FormInput
                    label="password"
                    type="password"
                    required
                    onChange={handleChange}
                    name="password"
                    value={password} >
                </FormInput>
                <div className="buttons-container">
                    <Button type='submit'>Sign in</Button>
                    <Button type='button' onClick={signInWithGoogle} buttonType="google">Google sign in</Button></div>

            </form>
        </div>
    )
}

export default SignInForm;