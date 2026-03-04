import webbrowser
import time

print("Iniciando a busca diária por vagas de Estágio Híbrido/Remoto em Direito...")
print("Abrindo as melhores plataformas com os filtros já aplicados para você. Boa sorte!\n")

# Lista das URLs de busca já com filtros de "Estágio", "Direito" e "Remoto/Home Office"
urls_vagas = [
    # LinkedIn: Filtro Estágio Direito Brasil + Remoto
    "https://www.linkedin.com/jobs/search/?keywords=est%C3%A1gio%20direito&location=Brasil&f_WT=2",
    
    # Gupy: Portal de vagas focado em tecnologia e empresas modernas (Legaltechs usam muito)
    "https://portal.gupy.io/job-search/term=est%C3%A1gio%20direito&jobTypes=est%C3%A1gio&workplaceTypes=remote",
    
    # Catho: Vagas de Estágio em Direito com filtro Home Office
    "https://www.catho.com.br/vagas/estagio-em-direito/?q=estagio%20em%20direito&trabalhoRemoto=1",
    
    # Vagas.com.br: Filtro para Estágio Direito Home Office
    "https://www.vagas.com.br/vagas-de-estagio-direito-home-office"
]

for idx, url in enumerate(urls_vagas):
    print(f"Abrindo portal {idx + 1}...")
    webbrowser.open(url)
    time.sleep(2) # Pausa rápida para não travar o navegador

print("\nTodas as abas foram abertas no seu navegador padrao!")
print("Dica: Separe 15 minutinhos do seu dia para olhar essas abas e mandar o currículo. Vai dar certo!")
