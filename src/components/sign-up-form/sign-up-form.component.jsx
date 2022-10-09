import { useState } from "react";
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import './sign-up-form.styles.scss'

const defaultFormFields = {
    displayName: "",
    email: "",
    password: "",
    confirmedPassword: ""
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmedPassword } = formFields;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmedPassword) {
            alert('Password does not match!');
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);
            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
        } catch (error) {
            if(error.code.includes('email-already-in-use')) {
                alert('Cannot create account! User already exists!');
            } else {
                console.error('ERROR creating the user', error);
            }
        }


    }

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value })
    }

    return (
        <div className="sign-up-container">
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Display Name"
                    type="text"
                    required
                    onChange={handleChange}
                    name="displayName"
                    value={displayName} />
                <FormInput
                    label="Email"
                    type="email"
                    required
                    onChange={handleChange}
                    name="email"
                    value={email} />
                <FormInput
                    label="Password"
                    type="password"
                    required
                    onChange={handleChange}
                    name="password"
                    value={password} />
                <FormInput
                    label="Confirm password"
                    type="password"
                    required
                    onChange={handleChange}
                    name="confirmedPassword"
                    value={confirmedPassword} />
                <Button type="submit">Sign up</Button>
            </form>
        </div>
    )
}

export default SignUpForm;