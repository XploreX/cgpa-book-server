import os
import subprocess as sp
from urllib.parse import urljoin
import requests
from multiprocessing import Process
from time import sleep
from datetime import timedelta,datetime
import random
import argparse
# Parser configs                                                                                                                                                                              
parser = argparse.ArgumentParser(description='used for testing cpga-book-server api')
parser.add_argument('-p', help='port to run server on(default:3000)')
parser.add_argument('-v', help='to show server logs or not', action="store_true")
args = parser.parse_args()

PORT=int(args.p) if(args.p) else 3000
url= os.environ.get("URL") if(os.environ.get("URL")!=None) else f'http://localhost:{PORT}/'
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
      if(args.v):
        print(output)

def test_url_get_list(path,params):
  success=True
  testurl=urljoin(url,path)
  sleeptime=0.5

  print_color(bcolors.HEADER,f'testing url {testurl}')
  print_color(bcolors.HEADER,f'testing without if-modified-since\n')

  r=requests.get(testurl,params=params)
  college_list=[]
  sleep(sleeptime)
  if(r.status_code==200):
    print_color(bcolors.OKGREEN,f'Success {r.status_code}')
    college_list=[i.strip().strip("\"''").strip() for i in r.text.strip('][').split(",")]
  else:
    print_color(bcolors.FAIL,f'Failed {r.status_code}')
    success=False
  print_seperator('-')

  print_color(bcolors.HEADER,f'testing with future if-modified-since\n')
  header={'If-modified-since':(datetime.now()+timedelta(hours=25)).isoformat()}
  
  r=requests.get(testurl,headers=header,params=params)
  sleep(sleeptime)
  if(r.status_code==304):
    print_color(bcolors.OKGREEN,f'Success {r.status_code}')
  else:
    print_color(bcolors.FAIL,f'Failed {r.status_code}')
    success=False
  print_seperator('-')

  header={'If-modified-since':(datetime.fromtimestamp(0)).isoformat()}
  print_color(bcolors.HEADER,f'testing with past if-modified-since\n')

  r=requests.get(testurl,headers=header,params=params)
  sleep(sleeptime)
  if(r.status_code==200):
    print_color(bcolors.OKGREEN,f'Success {r.status_code}')
  else:
    print_color(bcolors.FAIL,f'Failed {r.status_code}')
    success=False
  print_seperator('-')

  return college_list,success

def print_seperator(sep):
  if(sep=='*'):
    print("\n"*2+sep*80 +"\n"*2)
  elif(sep=='-'):
    print("\n"+sep*40 +"\n")

try:
  myenv=os.environ.copy()
  myenv["PORT"]=str(PORT)
  process=sp.Popen('npm start'.split(),env=myenv,stderr=sp.STDOUT,stdout=sp.PIPE)
  node=Process(target=start_node_server,args=(process,))
  node.start()
  sleep(5)
  keys=['college','course','branch','semester']
  paths=[
      '/academia/college-list',
      '/academia/course-list',
      '/academia/branch-list',
      '/academia/semester-list'
      ]
  params={}
  for i in range(len(keys)):
    out_list,res=test_url_get_list(paths[i],params)
    params[keys[i]]=out_list[random.randint(0,len(out_list)-1)].split("(")[0].strip()
    print_seperator('*')

except KeyboardInterrupt:
  pass
finally:
  process.terminate()
  node.terminate()
