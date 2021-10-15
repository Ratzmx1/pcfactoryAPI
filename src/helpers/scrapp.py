import requests
from bs4 import BeautifulSoup

url = "https://www.pcfactory.cl/liquidacion"

def scraping(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    array = []
    data = {}
    for cat in soup.select( 'div[data-id]'):
        categoryName = (cat["data-id"].replace("/liq-","").upper())
        
        prods = []
        for i in cat.find_all('div', class_='product'):  
            a = {}
            a["name"] = i.find('div', class_='price color-dark-2 product__card-title').text.replace("LIQ - ","")
            a["price"] = i.find('div', class_='title-md color-primary-1').text
            a["image"] = "https://www.pcfactory.cl/" + i.find('img')['src']
            a["url"] = "https://www.pcfactory.cl/" + i.find('a')['href']
            prods.append(a)
        data[categoryName] = prods
    return data

print(scraping(url))