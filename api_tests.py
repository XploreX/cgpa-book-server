import os
import subprocess as sp
from urllib.parse import urljoin
import requests
from multiprocessing import Process
from time import sleep
from datetime import timedelta,datetime

url = os.environ.get("URL") if(os.environ.get("URL")!=None) else 'http://localhost:3000/'
#url='http://api-rhapsody.herokuapp.com/'

class bcolors:
  HEADER = '\033[95m'
  OKBLUE = '\033[94m'
  OKCYAN = '\033[96m'
  OKGREEN = '\033[92m'
  WARNING = '\033[93m'
  FAIL = '\033[91m'
  ENDC = '\033[0m'
  BOLD = '\033[1m'
  UNDERLINE = '\033[4m'

def print_color(color,out):
  initstr=f'{color}{bcolors.BOLD}'
  if(color==bcolors.OKGREEN):
    symbol="[+] "
  elif(color==bcolors.FAIL):
    symbol="[-] "
  elif(color==bcolors.HEADER):
    symbol="[*] "
  elif(color==bcolors.WARNING):
    symbol="[!] "
  final=initstr+symbol+f'{out}{bcolors.ENDC}'
  print(final)

def start_node_server(process):
  while True:
    output=process.stdout.readline()
    if(output=='' and process.poll() is not None):
      break
    if output:
      output=output.decode().strip()
      if('MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017' in output):
        print_color(bcolors.FAIL,'enable mongodb service')
        break
      print(output)

def test_url_get_list(path,params):
  testurl=urljoin(url,path)
  sleeptime=0.5

  print_color(bcolors.HEADER,f'testing url {testurl}')
  print_color(bcolors.HEADER,f'testing without if-modified-since')

  r=requests.get(testurl,params=params)
  college_list=[]
  sleep(sleeptime)
  if(r.status_code==200):
    print_color(bcolors.OKGREEN,f'Success {r.status_code}')
    college_list=[i.strip().strip("\"''").strip() for i in r.text.strip('][').split(",")]
  else:
    print_color(bcolors.FAIL,f'Failed {r.status_code}')

  print_color(bcolors.HEADER,f'testing with future if-modified-since')
  header={'If-modified-since':(datetime.now()+timedelta(hours=25)).isoformat()}
  
  r=requests.get(testurl,headers=header,params=params)
  sleep(sleeptime)
  if(r.status_code==304):
    print_color(bcolors.OKGREEN,f'Success {r.status_code}')
  else:
    print_color(bcolors.FAIL,f'Failed {r.status_code}')

  header={'If-modified-since':(datetime.fromtimestamp(0)).isoformat()}
  print_color(bcolors.HEADER,f'testing with past if-modified-since')

  r=requests.get(testurl,headers=header,params=params)
  sleep(sleeptime)
  if(r.status_code==200):
    print_color(bcolors.OKGREEN,f'Success {r.status_code}')
  else:
    print_color(bcolors.FAIL,f'Failed {r.status_code}')

  return college_list

try:
  process=sp.Popen('npm start'.split(),stderr=sp.STDOUT,stdout=sp.PIPE)
  node=Process(target=start_node_server,args=(process,))
  node.start()
  sleep(5)
  params={}
  out_list=test_url_get_list('/academia/college-list',params)
  params["college"]=out_list[0].split("(")[0].strip()
  out_list=test_url_get_list('/academia/course-list',params)
  params["course"]=out_list[0].split("(")[0].strip()
  out_list=test_url_get_list('/academia/branch-list',params)
  params["branch"]=out_list[0].split("(")[0].strip()
  out_list=test_url_get_list('/academia/semester-list',params)
  params["semester"]=out_list[0].split("(")[0].strip()

except KeyboardInterrupt:
  pass
finally:
  process.terminate()
  node.terminate()
