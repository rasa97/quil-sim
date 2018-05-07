import json
import urllib

import pyquil.quil as pq
import pyquil.api as api
from pyquil.gates import *

qvm = api.QVMConnection()


from flask import Flask, request, redirect, url_for, render_template, jsonify

app = Flask(__name__)

@app.route('/', methods = ['POST', 'GET'])
def serv():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        p = pq.Program()
        cmd = ""
        for key in data:
            t = data[key]
            for i in t:
                cmd=cmd+i+"\n"
        p.inst(cmd)
        wvf= qvm.wavefunction(p)
        return jsonify(wvf.get_outcome_probs())
    
    return render_template('index.html')    

if __name__ == "__main__":
	app.run()