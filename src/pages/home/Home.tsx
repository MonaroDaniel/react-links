import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import Social from "../../components/Social/Social"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

interface SocialLinksProps {
  facebook: string;
  youtube: string;
  instagram: string;
}

export default () => {
  const [links, setLinks] = useState<Array<LinkProps>>([])
  const [social, setSocial] = useState<SocialLinksProps>()

  useEffect(() => {
    function loadLinks() {
      const linksRef = collection(db, "links")
      const queryRef = query(linksRef, orderBy("created", "asc"))

      getDocs(queryRef)
        .then((snapshot) => {
          let lista = [] as LinkProps[]
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.data().id,
              bg: doc.data().bg,
              color: doc.data().color,
              name: doc.data().name,
              url: doc.data().url
            })
          })
          setLinks(lista)
        })
    }
    loadLinks()

  }, [])

  useEffect(() => {
    function loadSocialLinks() {
      const docRef = doc(db, "social", "link")
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.data() !== undefined) {
            setSocial({
              facebook: snapshot.data()?.facebook,
              youtube: snapshot.data()?.youtube,
              instagram: snapshot.data()?.instagram,
            })
          }
        })
    }
    loadSocialLinks()
  }, [])

  function renderLinks(data: LinkProps[]) {
    return data.map((item) => (
      <section
        style={{ backgroundColor: item.bg }}
        key={item.id}
        className="bg-white mb-4 w-ffull py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
      >
        <a href={item.url} target="_blank">
          <p
            style={{ color: item.color }}
            className="text-base md:text-lg"
          >
            {item.name}
          </p>
        </a>
      </section>
    ))
  }

  function renderSocialLinks(data: SocialLinksProps) {
    if (data && Object.keys(data).length > 0) {
      return (
        <footer className="flex justify-center gap-3 my-4">
          <Social url={data.facebook}>
            <FaFacebook size={35} color="#fff" />
          </Social>

          <Social url={data.youtube}>
            <FaYoutube size={35} color="#fff" />
          </Social>

          <Social url={data.instagram}>
            <FaInstagram size={35} color="#fff" />
          </Social>
        </footer>
      )
    }
  }

  return (
    <div className="flex flex-col w-full py-4 items-center justify-center">
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">Sujeito Programador</h1>
      <span className="text-gray-50 mb-5 mt-3">Veja meus links🔗</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {renderLinks(links)}

        {social && Object.keys(social).length > 0 && renderSocialLinks(social)}

      </main>
    </div>
  )
}