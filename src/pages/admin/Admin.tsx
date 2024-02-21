import { FormEvent, useEffect, useState } from "react"
import Header from "../../components/Header/Header"
import Input from "../../components/Input/Input"
import { FiTrash } from "react-icons/fi"
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from "../../services/firebaseConnection"

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

export default () => {
  const [nameInput, setNameInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [textColorInput, setTextColorInput] = useState('#f1f1f1')
  const [backgroundColorInput, setBackgroundColorInput] = useState('#12121212')

  const [links, setLinks] = useState<Array<LinkProps>>([])

  useEffect(() => {
    const linksRef = collection(db, "links")
    const queryRef = query(linksRef, orderBy("created", "desc"))

    const unsub = onSnapshot(queryRef, (snapshot) => {
      let lista: Array<LinkProps> = []
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color
        })
      })

      setLinks(lista)

      return () => {
        unsub()
      }
    })

  }, [])

  function handleRegister(e: FormEvent) {
    e.preventDefault()

    if (nameInput.trim().length <= 0 || urlInput.trim().length <= 0) {
      alert('Preencha todos os campos')
      return
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      bg: backgroundColorInput,
      color: textColorInput,
      created: new Date()
    }).then((_) => {
      setNameInput('')
      setUrlInput('')
    }).catch((error) => {
      console.log(error);
    })
  }

  async function handleDeleteDoc(id:string) {
    const docRef = doc(db, "links", id)
    await deleteDoc(docRef)
  }

  function renderLinks() {
    return links.map((item) => (
      <article key={item.id} className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
        style={{
          backgroundColor: item.bg,
          color: item.color
        }}
      >
        <p>{item.name}</p>
        <div>
          <button
            className="border border-dashed p-1 rounded bg-neutral-900"
          >
            <FiTrash onClick={() => handleDeleteDoc(item.id)} size={18} color="#FFF" />
          </button>
        </div>
      </article>
    ))
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />

      <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={handleRegister}>
        <label className="text-white font-semibold mt-2 mb-2">Nome do Link</label>
        <Input
          placeholder="Digite o nome do link..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <label className="text-white font-semibold mt-2 mb-2">Url do Link</label>
        <Input
          type="url"
          placeholder="Digite a url..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="flex my-4 gap-5">
          <div className="flex gap-2">
            <label className="text-white font-semibold mt-2 mb-2">Cor do Link</label>
            <input
              type="color"
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <label className="text-white font-semibold mt-2 mb-2">Fundo do Link</label>
            <input
              type="color"
              value={backgroundColorInput}
              onChange={(e) => setBackgroundColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput.trim().length > 0 && (
          <div className="flex items-center justify-start flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
            <label className="text-white font-semibold mt-2 mb-3">Veja como está ficando</label>
            <article
              className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
              style={{
                marginBottom: 8,
                marginTop: 8,
                backgroundColor: backgroundColorInput
              }}
            >
              <p className="font-semibold"
                style={{
                  color: textColorInput
                }}
              >
                {nameInput}
              </p>
            </article>
          </div>
        )}

        <button
          type="submit"
          className="mb-7 bg-blue-600 h-9 rounded-md text-white font-semibold gap-4 flex justify-center items-center">
          Cadastrar
        </button>
      </form>

      <h2 className="font-bold text-white mb-4 text-2xl">
        Meus Links
      </h2>

      {renderLinks()}

    </div>
  )
}