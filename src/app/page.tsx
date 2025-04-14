'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import '@/styles/globals.css'
import Image from 'next/image'
import initMainScripts from '@/scripts/main.js'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    initMainScripts()
  }, [])


  return (
    <>
      <Head>
        <title>ZapChatBR - Soluções Inteligentes para o Seu Negócio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https:/cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </Head>

      <header>
        <nav>
          <div className="logo">
            <Image src="/imgs/logo.png" alt="ZapChatBR Logo" width={120} height={40} />
          </div>
          <div className="hamburger-menu">
            <i className="bi bi-list"></i>
          </div>

          <ul className="nav-links">
            <li><a href="#services">Serviços</a></li>
            <li><a href="#diferenciais">Diferenciais</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
          <div className="cta-buttons">
            <a href="https:/wa.me/SEUNUMERO" target="_blank" className="btn btn-primary">
              <button><i className="bi bi-whatsapp"></i></button>
            </a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>ZapChatBR</h1>
          <h2><span className="rotating-words"></span>Inteligente para o Seu Negócio</h2>
          <p>Desenvolvemos softwares, automações e integrações para impulsionar seu negócio com segurança e eficiência.</p>
          <button onClick={() => router.push("/login")} className="btn">
            Acessar Dashboard
          </button>
        </div>
      </section>

      <section id="services" className="services">
        <h2>Nossos Serviços</h2>
        <div className="button-container">
          <button className="service-button active" data-target="automatizacao">Automatização</button>
          <button className="service-button" data-target="otimizacao">Otimização</button>
          <button className="service-button" data-target="integracao">Integração</button>
          <button className="service-button" data-target="gestao">Gestão</button>
        </div>

        <div className="service-content active" id="automatizacao">
          <div className="card">
            <div className="text-content">
              <h3>Automatização Inteligente</h3>
              <p>Soluções personalizadas para maximizar sua produtividade e segurança.</p>
            </div>
            <Image src="/imgs/automatizacao.png" alt="Automatização Inteligente" width={500} height={300} />
          </div>
        </div>

        <div className="service-content" id="otimizacao">
          <div className="card">
            <div className="text-content">
              <h3>Otimização de Processos</h3>
              <p>Reduza desperdícios e aumente a eficiência operacional.</p>
            </div>
            <Image src="/imgs/otimizacao.png" alt="Otimização de Processos" width={500} height={300} />
          </div>
        </div>

        <div className="service-content" id="integracao">
          <div className="card">
            <div className="text-content">
              <h3>Integrações Personalizadas</h3>
              <p>Conectamos sistemas para criar um ecossistema digital unificado.</p>
            </div>
            <Image src="/imgs/integracao.png" alt="Integrações Personalizadas" width={500} height={300} />
          </div>
        </div>

        <div className="service-content" id="gestao">
          <div className="card">
            <div className="text-content">
              <h3>Gestão de Dados</h3>
              <p>Coleta, armazenamento e análise de dados para decisões estratégicas.</p>
            </div>
            <Image src="/imgs/gestao.png" alt="Gestão de Dados" width={500} height={300} />
          </div>
        </div>
        </section>

      <section id="faq" className="faq">
        <h2>FAQ</h2>
        <div className="faq-content">
          <div className="faq-item">
            <button className="faq-question">
              <p>Como a ZapChatBR pode ajudar minha empresa?</p>
            </button>
            <div className="faq-answer">
              <p>Oferecemos soluções personalizadas em automação, integração de sistemas e segurança digital.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-question">
              <p>Quais são os benefícios da automação?</p>
            </button>
            <div className="faq-answer">
              <p>Redução de custos, aumento da produtividade e eliminação de tarefas repetitivas.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Entre em Contato</h2>
        <p>Estamos prontos para transformar sua empresa com nossas soluções inovadoras.</p>
        <div className="contact-cards">
          <div className="contact-card">
            <div className="icon"></div>
            <button><i className="bi bi-envelope"></i></button>
            <p><strong>E-mail:</strong> contato@zapchatbr.com</p>
          </div>
          <div className="contact-card">
            <div className="icon"></div>
            <button><i className="bi bi-whatsapp"></i></button>
            <p><strong>Telefone:</strong> (XX) XXXX-XXXX</p>
          </div>
        </div>
        <a href="https:/wa.me/SEUNUMERO" className="btn btn-primary" target="_blank" rel="noopener noreferrer">Fale Conosco</a>
        <form className="contact-form">
          <input type="text" placeholder="Seu Nome" required />
          <input type="email" placeholder="Seu E-mail" required />
          <textarea placeholder="Sua Mensagem" rows={5} required></textarea>
          <button type="submit" className="btn btn-secondary">Enviar Mensagem</button>
        </form>
      </section>

      <footer>
        <div className="footer-content">
          <div className="logo">
            <Image src="/imgs/logo.png" alt="ZapChatBR Logo" width={120} height={40} />
          </div>
          <div className="footer-links">
            <li><a href="#services">Serviços</a></li>
            <li><a href="#diferenciais">Diferenciais</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contato</a></li>
          </div>
          <div className="footer-contact">
            <div className="contact-info">
              <p><strong>E-mail:</strong> contato@zapchatbr.com</p>
              <p><strong>Telefone:</strong> (XX) XXXX-XXXX</p>
              <a href="https:/wa.me/SEUNUMERO" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                <button><i className="bi bi-whatsapp"></i></button>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}