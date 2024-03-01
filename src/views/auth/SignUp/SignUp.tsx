import SignUpForm from './SignUpForm'

const SignUp = () => {
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">Regístrate</h3>
        <p className="leading-relaxed">
          Ingrese sus datos para crear una cuenta y poder disfrutar de
          <br />
          los beneficios de nuestro sistema.
        </p>
      </div>
      <SignUpForm disableSubmit={false} />
    </>
  )
}

export default SignUp
