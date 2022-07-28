import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from "styled-components"


interface ITouchWidth{
  width: number,
  onClick?: any
}

interface IOperator{
  name: string,
  src: string,
  href: string
}

interface IAddOperatopPopup{
  operators: Array<IOperator>,
  setOperators: (value : Array<IOperator> | ((prev: Array<IOperator>) => Array<IOperator>)) => void,
  quitPopup: () => void
}

interface IAdditionalOperator{
  operators : Array<IOperator>,
  setOperators : (value : Array<IOperator> | ((prev: Array<IOperator>) => Array<IOperator>)) => void,
  operator : IOperator
}

interface IStyledInput{
  isInputError: boolean
}
interface IDeleteOperatorWrapper{
  onClick: any
}

interface IStyledOperator{
  onTouchStart?: any,
  onTouchMove?: any,
  onTouchEnd?: any,
  onMouseOver?: any,
  onMouseOut?: any,

}


export const Header = () => {
  const StyledHeader = styled.header`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100px;
    @media (min-width:320px)  {
      padding: 5px 5vw;
    }
    @media (min-width:600px)  {
      padding: 10px 3vw;
    }
  `;

  const StyledHeaderLink = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  column-gap: 2vw;
  cursor: pointer;
`;

  const StyledHeaderLinkName = styled.span`
    display: block;
    font-size: 1.3rem;
`;

  return(
    <StyledHeader>
      <Link href='/'>
        <StyledHeaderLink>
          <Image src={'/logo.svg'} width={50} height={50}></Image>
          <StyledHeaderLinkName>Mobile Terminal</StyledHeaderLinkName>
        </StyledHeaderLink>
      </Link>
    </StyledHeader>
  )
}

const Main = () => {
  const [isNewOperator, setAddNewOperator] = useState(false);
  const [operators, setOperators] = useState<Array<IOperator>>([{name: "operator", src: "/src.png", href: "href"}]);

  useEffect(() => {
    if (localStorage.getItem('operators') === null){
      const mainOperators : Array<IOperator> = [{name: "Билайн", src: "/operators/beeline.png", href: "beeline"}, 
                            {name: "Мегафон", src: "/operators/megafon.png", href: "megafon"},
                            {name: "МТС", src: "/operators/mts.png", href: "mts"}]
      setOperators(mainOperators)
      localStorage.setItem('operators', JSON.stringify(mainOperators))
    }
    else{
      const lsOperators: Array<IOperator>  =  JSON.parse(localStorage.getItem('operators') || '')
      setOperators(lsOperators)
    }
  }, [])



  return(
    <StyledMain>
      <StyledGreeting>Добро пожаловать!</StyledGreeting>
      <StyledDescription>Выберите нужного вам оператора и перейдите на страницу оплаты</StyledDescription>
      <StyledOperators>
        {operators.map((operator, operatorIndex) =>
          operatorIndex < 3 ? 
         <Link key={operator.href} href={`/operators/${operator.href}`}><StyledOperator><Image src={operator.src} width={200} height={200}></Image><StyledOperatorName>{operator.name}</StyledOperatorName></StyledOperator></Link>:
         <AdditionalOperator key={operator.href} operators={operators} setOperators={setOperators} operator={operator}></AdditionalOperator>
         )}
        <StyledOperator onClick={() => {document.body.style.overflow = 'hidden'; setAddNewOperator(true)}}><Image src={'/addOperator.svg'} width={300} height={300}></Image></StyledOperator>
      </StyledOperators>
      {isNewOperator && 
      <AddOperatopPopup operators={operators} setOperators={setOperators} quitPopup={() => {document.body.style.overflow = 'unset'; setAddNewOperator(false)}}/>}
    </StyledMain>
  ) 
}

const AdditionalOperator = ({operators, setOperators, operator} : IAdditionalOperator) => {
  const [isHover, setHover] = useState(false);
  const [isTouch, setTouch] = useState(false);
  const [initialSlideX, setInitialSlideX] = useState(0);
  const [deleteOperatorTouchWidth, setDeleteOperatorTouchWidth] = useState(0);

  const deleteOperator = (e : React.MouseEvent<HTMLButtonElement> | null): void => {
    e?.stopPropagation()
    setOperators((prev : Array<IOperator>) => prev.filter((op) => JSON.stringify(op) !== JSON.stringify(operator)))
    localStorage.setItem('operators', JSON.stringify(operators.filter((op) => JSON.stringify(op) !== JSON.stringify(operator))))
  }

  const onTouchStart = (e: React.TouchEvent<HTMLButtonElement>): void => {setTouch(true); setInitialSlideX(e.touches[0].clientX) };

  const onTouchMove = (e: React.TouchEvent<HTMLButtonElement>): void => {setDeleteOperatorTouchWidth(-(initialSlideX - e.touches[0].clientX) > 75? 75: -(initialSlideX - e.touches[0].clientX) < 0 ?  0: -(initialSlideX - e.touches[0].clientX))};

  const onTouchEnd = (e: React.TouchEvent<HTMLButtonElement>): void => {setTouch(false); deleteOperatorTouchWidth > 0  && deleteOperator(null)};

  const DeleteOperator = () => {
    return(
      <DeleteOperatorWrapper onClick={deleteOperator}>
        <Image src='/deleteOperator.svg' width={48} height={48}></Image>
      </DeleteOperatorWrapper>
    )
  }
  const DeleteOperatorTouch = ({width} : ITouchWidth) => {
    return(
      <DeleteOperatorTouchWrapper width={width} onClick={deleteOperator}>
        {width > 30 && <Image src='/deleteOperator.svg' width={width <= 48? width: 48} height={width <= 48? width: 48}></Image>}
      </DeleteOperatorTouchWrapper>
    )
  }

  return(<Link href={`/operators/${operator.href}`}><StyledOperator onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onMouseOver={() => {setHover((prev: boolean) => !prev)}} onMouseOut={() => {setHover((prev: boolean) => !prev)}}>
          <Image src={operator.src} width={200} height={200}></Image>
          <h1>{operator.name}</h1>
          {isHover && !isTouch && <DeleteOperator/>}
          {!isHover && isTouch && <DeleteOperatorTouch width={deleteOperatorTouchWidth}/>}
        </StyledOperator></Link>)
}


const AddOperatopPopup = ({operators, setOperators, quitPopup} : IAddOperatopPopup) => {
  const [operatorName, setOperatorName] = useState('')
  const [operatorLogo, setOperatorLogo] = useState('')
  const [operatorHref, setOperatorHref] = useState('')
  const [isInputError, setInputError] = useState({operatorName: false, operatorHref: false});

  const BG = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #00000052;
    cursor: pointer;
  `
  const AddOperatopSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInputError({operatorName: operatorName === '', operatorHref: operatorHref === ''})
    if(operatorName === '' || operatorHref === ''){
      return
    }
    const newOperator = {name: "", src: "", href: ""}
    newOperator.name = operatorName;
    newOperator.src = operatorLogo === '' ? '/default.svg' : operatorLogo;
    newOperator.href = operatorHref;
    setOperators(prev => [...prev, newOperator]);
    localStorage.setItem('operators', JSON.stringify([...operators, newOperator]));
    quitPopup();
  }
  
  return (
          <div>
            <BG onClick={quitPopup}></BG>
            <AddOperatopPopupForm>
              <AddOperatopPopupDescription>Добавить нового оператора</AddOperatopPopupDescription>
              <StyledInput isInputError={isInputError.operatorName} onChange={(e : React.ChangeEvent<HTMLInputElement>) => {setOperatorName(e.target.value)}} value={operatorName} placeholder='Название оператора'></StyledInput>
              <StyledFileInputLabel>
                <StyledFileInputPlaceholder onClick={(e : React.MouseEvent<HTMLInputElement>) => {e.preventDefault()}}>Логотип оператора</StyledFileInputPlaceholder>
                <StyledFileInputButton>Загрузить файл</StyledFileInputButton>
                <StyledFileInput onChange={(e : React.ChangeEvent<HTMLInputElement>) => {setOperatorLogo(e.target.files !== null? ('/operators/' + e.target.files[0]?.name): '/default.svg')}} type='file' placeholder='Логотип оператора'></StyledFileInput>
              </StyledFileInputLabel>
              
              <StyledInput isInputError={isInputError.operatorHref} onChange={(e : React.ChangeEvent<HTMLInputElement>) => {setOperatorHref(e.target.value)}} value={operatorHref} placeholder='Путь к оператору'></StyledInput>
              <StyledButton onClick={AddOperatopSubmit}>{'Добавить'}</StyledButton>
            </AddOperatopPopupForm>
          </div>)
}


const StyledInput = styled.input<IStyledInput>`
  width: 20rem;
  font-size: 1.4rem;
  border: none;
  border-bottom: 2px solid;
  padding: 0.5rem 0.2rem;
  border-bottom-color: ${props => props.isInputError? '#FE0000' : '#474747'};
  :focus{
      border-bottom-color: #fff;
      outline: none;
  }
`;


const StyledFileInput = styled.input`
  width: 0;
  height: 0;
  visibility: hidden;
  position: absolute;
  left: 0%;
  top: 0%;
`;


const StyledFileInputButton = styled.span`
  display: block;
  text-align: center;
  width: 20rem;
  font-size: 1.4rem;
  padding: 1vh 1vw;
  background-color: #344070;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.1s ease-in-out;
  :hover{
    color: #000;
    background-color: #fff;
  }
`;


const StyledFileInputPlaceholder = styled.p`
  color: #707070;
  display: block;
  width: 20rem;
  font-size: 1.4rem;
  border: none;
  padding: 1vh 1vw;
`;


const StyledFileInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
`;


const AddOperatopPopupForm = styled.form`
background-color: #1e2647;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: fixed;
row-gap: 2vh;
padding: 3vh 3vw;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`;

const AddOperatopPopupDescription = styled.h1`
  @media (min-width:320px)  {
    font-size: 1.5rem;
    padding: 0 2vw;
    }
  @media (min-width:600px)  {
    font-size: 2rem;
  }
`;


const StyledButton = styled.button`
    width: 20rem;
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0.5rem 0.2rem;
    border: 2px solid #474747;
    border-radius: 10px;
    color: #707070;
    :hover{
    color: #fff;
    border-color: #fff;
}
`;


const StyledMain = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    row-gap: 3vh;
    padding: 2vh 2vw;
`; 


const StyledGreeting = styled.h1`
  @media (min-width:320px)  {
    font-size: 1.5rem;
    }
  @media (min-width:600px)  {
    font-size: 2rem;
  }
`;


const StyledDescription = styled.p`
  text-align: center;
  display: inline-block;
  width: 80%;
  @media (min-width:320px)  {
    font-size: 0.8rem;
    }
  @media (min-width:600px)  {
    font-size: 1rem;
  }
`;

const StyledOperators = styled.div`
  display: grid;
  width: 80%;
  gap: 3vh 3vw;
  padding: 2vh 2vw;
  ::-webkit-scrollbar{
    background-color: #212847;
  }
  ::-webkit-scrollbar-thumb{
    background-color: #343e6b;
  }
  @media (min-width:320px)  {
    grid-template-columns: 1fr;
  }
  @media (min-width:750px)  {
    max-height: 73vh;
    overflow-y: auto;
    overflow-x: hidden;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width:1280px)  {
    max-height: 73vh;
    overflow-y: auto;
    overflow-x: hidden;
    grid-template-columns: repeat(3, 1fr);
  }
  
`;


const StyledOperator = styled.div<IStyledOperator>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 400px;
  row-gap: 2vh;
  padding: 2vh 2vw;
  cursor: pointer;
  box-sizing: content-box;
  :hover{
    background-color: #12172b;
    outline: 1px solid #0f121d;
  }
`;

const StyledOperatorName = styled.h1`
  @media (min-width:320px)  {
    font-size: 1.5rem;
  }
  @media (min-width:600px)  {
    font-size: 2rem;
  }
`;

  
const DeleteOperatorWrapper = styled.div<IDeleteOperatorWrapper>`
  position: absolute;
  right: 0;
  top: 0;
  background-color: #FE0000;
  padding: 2px;
  z-index: 0;
`;


const DeleteOperatorTouchWrapper = styled.div<ITouchWidth>`
  position: absolute;
  left: 0;
  top: 0;
  border-right: 1px solid #0f121d;
  background-color: #FE0000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: ${props => props.width +'px'};
  z-index: 0;
`;

const Terminal: NextPage = () => {
  const StyledPage = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-color: #161B30;
  `;
  return (
    <StyledPage>
      <Header/>
      <Main/>
    </StyledPage>
  )
}

export default Terminal;
