import { NextPage } from 'next';
import {Header} from '../index';
import { useRouter } from 'next/router';
import styled from "styled-components";
import InputMask from 'react-input-mask';
import { useState, useEffect } from 'react';
import Image from 'next/image';


interface IOperator{
    name: string,
    src: string,
    href: string
  }


interface IStyledInput{
    isInputError: boolean
}


interface IProgressBar{
    animation: boolean
}


interface INotificationWrapper{
    isError: boolean
}


interface INotification {
    notification: string,
    isError: boolean
}


const PaymentMain = () => {
    const router = useRouter();
    const [operatorName, setOperatorName] = useState('');
    const [operatorSrc, setOperatorSrc] = useState('/operators/megafon.png')

    const [phone, setPhone] = useState('');
    const [sum, setSum] = useState('');
    const [notification, setNotification] = useState('');
    const [isError, setError] = useState(false);
    const [isSubmitAvailable, setSubmitAvailable] = useState(true);
    const [isInputError, setInputError] = useState({phone: false, sum: false});

    useEffect(() => {
        if(!router.isReady) return;
        const operatorHref = router?.query?.page as string;
        const chosenOperator = JSON.parse(localStorage.getItem('operators') || '').filter((operator : IOperator) => operator.href === operatorHref)[0]
        setOperatorName(chosenOperator.name)
        setOperatorSrc(chosenOperator.src)
    }, [router.isReady])



    const onSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setInputError(prev => ({phone: phone === '' || phone.length !== 16, sum: sum === ''}));
        if (!sum || phone === '' || phone.length < 16) return;
        else if (Math.random() > 0.5) {
            setNotification('Оплата произошла успешно!')
            setError(false);
            setSubmitAvailable(false)
            setTimeout(() => {
                router.push('/')
            }, 2000)
        }
        else{
            setNotification('Произошла небольшая неполадка, повторите запрос')
            setError(true);
            setSubmitAvailable(false)
            setTimeout(() => {
                setNotification('');
                setSubmitAvailable(true)
            }, 2000);
        }
    }

    return (<StyledMain>
                <Operator>
                    <Image src={operatorSrc} width={50} height={50}></Image>
                    <h1>{operatorName}</h1>
                </Operator>
                <StyledForm>
                    <InputMask
                        mask="+7 999 999-99-99"
                        maskChar=""
                        value = {phone}
                        disabled={false}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPhone(e.target.value)}}
                        >
                        {() =><StyledInput isInputError={isInputError.phone} placeholder={"Номер телефона"}></StyledInput>}
                    </InputMask>
                    <StyledInput type='number' isInputError={isInputError.sum} value={sum} onChange = {
                        (e : React.ChangeEvent<HTMLInputElement>) => {(parseInt(e.target.value) > 0
                         && parseInt(e.target.value) <= 1000 || e.target.value === "") && setSum(e.target.value)}
                        } placeholder={"Сумма (1-1000)"}/>
                    <StyledButton onClick={isSubmitAvailable? onSubmit : (e : React.MouseEvent<HTMLButtonElement>) => {e.preventDefault()}}>{'Оплатить'}</StyledButton>
                </StyledForm>
                {notification !== '' && <Notification notification={notification} isError={isError}></Notification>}  
            </StyledMain>)
}


const Notification = ({notification, isError}: INotification ) => {
    return(
    <NotificationWrapper isError={isError}>
        <p>{notification}</p>
        <ProgressBar animation={notification !== ''}></ProgressBar>
    </NotificationWrapper>)
}


const Operator = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    column-gap: 2vw;
`;


const StyledInput = styled.input`
    width: 20rem;
    font-size: 1.4rem;
    border: none;
    border-bottom: 2px solid;
    padding: 0.5rem 0.2rem;
    border-bottom-color: ${(props: IStyledInput) => props.isInputError? '#FE0000' : '#474747'};
    :focus{
        border-bottom-color: #fff;
        outline: none;
    }
    :placeholder{
        color: #fff;
    }
    `;


const StyledMain = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 90vh;
    row-gap: 5vh;
    position: relative;
`;


const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    row-gap: 2vh;
`;


const StyledButton = styled.button`
    width: 20rem;
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0.5rem 0.2rem;
    border: 2px solid #474747;
    border-radius: 5px;
    color: #707070;
    :hover{
    color: #fff;
    border-color: #fff;
}
`;


const StyledPage = styled.div`
        display: flex;
        flex-direction: column;
        width: 100vw;
        min-height: 100vh;
        background-color: #161B30;
    `;


const ProgressBar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    ${(props: IProgressBar) => (props.animation && 'animation: progress 2s;')}
    height: 1vh;
    background-color: #fff;
    @keyframes progress {
        from{
            width: 0%;
        }
        to{
            width: 100%;
        }
    }
`;


const NotificationWrapper = styled.div`
    position: absolute;
    text-align: center;
    bottom: 5vh;
    left: 5vw;
    background-color: ${(props : INotificationWrapper) => props.isError && '#FE0000' || !props.isError && '#00975F'};
    padding: 2vh 1vw;
    @media (min-width:320px)  {
    font-size: 1rem;
    width: 60vw;
    }
    @media (min-width:600px)  {
        font-size: 1.3rem;
        width: unset;
    }
`;

const PaymentPage: NextPage = () => {
    return(
        <StyledPage>
            <Header/>
            <PaymentMain/>
        </StyledPage>
    )
}

export default PaymentPage;