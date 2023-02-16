// <!DOCTYPE html>
// <html>
//   <body>
//     thing a:
//     <input /><br />
//     thing b:
//     <input /><br />
//     thing c:
//     <input /><br />
//     complicated as f thing d:<br />
//     <textarea></textarea><br />
//     <button>Submit</button>
//   </body>
// </html>

import { StructArea } from '@prospectfive/structarea'

const ModalButtonCombo = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <Modal isOpen={isOpen}></Modal>
      <button onClick={() => setIsOpen(true)}></button>
    </div>
  )
}

const StructArea = (props) => {
  const handleOnChangeAutoIndent = (e) => {
    // e.target.value, except it will automatically pad the string to the left for 'auto-indenting'
    //
    //
    // foo
    //     foo,
  }
  return <textarea></textarea>
}

const MyForm = () => {
  return (
    <div>
      <input name='firstName' />
      <input name='lastName' />
      <StructArea name='sourceDB' struct={SourceDatabase} />
      <ModalButtonCombo />
      <ModalButtonCombo />
      <ModalButtonCombo />
    </div>
  )
}

export default MyForm
