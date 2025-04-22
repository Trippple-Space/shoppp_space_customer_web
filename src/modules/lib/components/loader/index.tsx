interface LoaderProps {
    variant: string
  }
  
  const Loader = ({variant}:LoaderProps) => {
    return (
      <div className={`${variant}-loader`} />
    )
  }
  
  export default Loader