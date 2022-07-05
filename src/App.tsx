import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase';
import { doc, setDoc, collection, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { GridLoader } from 'react-spinners';
import Confetti from 'react-confetti';
import { useWindowSize } from './hooks/useWindowSize';

const DOC_ID = '1S4ITBhyECihDjAVkGSh';
const MAX_USERS = 20;

function App() {
    const [user, setUser] = useState({
        initials: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userCount, setUserCount] = useState(20);
    const [success, setSuccess] = useState(false);
    const { width, height } = useWindowSize()


    const initDB = async () => {
        const usersDocRef = doc(db, 'users', DOC_ID);
        const docSnap = await getDoc(usersDocRef);

        if (!docSnap.exists()) {
            return;
        }

        const { users } = docSnap.data();

        setUserCount(users.length);

        console.log('users', users);
    };
    
    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async () => {
        const isEmailValid = validateEmail(user.email);
        const isInitialsValid = user.initials.length > 1 && user.initials.length < 4;

        if (!isEmailValid) {
            setError('Provided email is invalid.');

            return;
        }
        
        if (!isInitialsValid) {
            setError('Initials must be 2-3 characters in length.');

            return;
        }
        
        if (MAX_USERS <= userCount) {
            setError('There are no more spots available.');

            return;
        }
        setLoading(true);

        try {
            const usersDocRef = await doc(db, 'users', DOC_ID);
            await updateDoc(
                usersDocRef,
                {
                    users: arrayUnion(user)
                }
            );
    
            initDB();
            setSuccess(true);
        } catch (error) {
            console.log('error', error);
            setError('Something went wrong, please contact Arvin to fix this.')
        }
        setLoading(false);
    }

    const handleInitials = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();

        setUser(prev => ({ ...prev, initials: val }));
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setUser(prev => ({ ...prev, email: val }));
    }

    useEffect(
        () => {
            initDB();
        }, []
    )
    
    return (
        <body>
            <Confetti
                width={width}
                height={height}
                run={success}
                recycle={false}
            />
            <div className='background'>
                <div className='stylish-rectangle blue'></div>
                <div className='stylish-rectangle purple'></div>
                <div className='stylish-rectangle purple purple-right'></div>
            </div>

            <main>
                <a href='https://abyte.ca' target='_blank' rel='noopener noreferrer'>
                    <img 
                        src='/logo-black.png' 
                        alt='aByte Logo' 
                        id='logo' 
                    />
                </a>

                    <div className='auth-card'>
                        <h1>Add credentials to sync</h1>

                        <label htmlFor='initials'>Initials (Your initials from the spreadsheet)</label>
                        <input 
                            id='initials' 
                            className='sleek-input' 
                            type='text' 
                            placeholder='ARA' 
                            onChange={handleInitials}
                        />

                        <label htmlFor='email'>Email (Calendar invites will be sent to this email)</label>
                        <input 
                            id='email' 
                            className='sleek-input' 
                            type='email' 
                            placeholder='rick@roll.haha'
                            onChange={handleEmail}
                        />

                        <p id="error">{error}</p>

                        {
                            success ? (
                                <p 
                                    id='success'
                                >
                                    Your credentials have been saved. 
                                    <br />
                                    <br />
                                    You will now start receiving calendar invites on Sundays to the email {user.email}.
                                </p>
                            ) : (
                                <button 
                                    id='submit'
                                    onClick={handleSubmit}
                                    disabled={MAX_USERS <= userCount || loading}
                                >
                                    Continue
                                    {
                                        loading &&
                                        <GridLoader 
                                            className='loader'
                                            color='#fff'
                                            size={6}
                                        />
                                    }
                                </button>
                            )
                        }

                        {
                            !success &&
                            <p 
                                id='sso-link'
                                className={
                                    MAX_USERS <= userCount ? 'reject' : ''
                                }
                            >
                                {MAX_USERS - userCount} spots remaining.
                            </p>
                        }
                    </div>

                    <p id='no-account'>
                        This product is made by <a href='https://abyte.ca' target='_blank' rel='noopener noreferrer'>aByte Inc.</a> and not by Lighthouse Labs.
                        <br />
                        <br />
                        <span>
                            THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                        </span>
                        <br />
                        <br />
                        <span>
                            Design inspired by Stripe.
                        </span>
                    </p>

            </main>

        </body>
    );
}

export default App;
