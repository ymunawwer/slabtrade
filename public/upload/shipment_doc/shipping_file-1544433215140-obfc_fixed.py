import random
import string
from tkinter import *
import os
import numpy as np
import pandas as pd
from math import sqrt
import matplotlib.pyplot as plt
import datetime as dt
import tkinter as tk
from tkinter import messagebox
from collections import OrderedDict
# from IPython.core.magic import register_cell_magic
# from tkFileDialog import *
from tkinter.filedialog import askopenfilename
# from tkinter import filedialog


root = Tk()
root.geometry("800x600")
# Header
header = Frame(root, width=800, bg='#CCC', height=50, borderwidth=2)
header.pack(expand=True, fill='y', side='top', anchor='nw')
header.pack_propagate(0)
#scroll

vsb = Scrollbar(orient="vertical")
text = Text(width=40, height=20,yscrollcommand=vsb.set)
vsb.config(command=text.yview)
vsb.pack(side="left", fill="y")
text.pack(side="left", fill="both", expand=True)
# end


#scroll

default_cols=['UID','First Name','Last Name','Full Address','City','State','5 Digit Zip Code','9 Digit Zip Code','Phone Number','Valid Email']
default_cols_uid=['First Name','Last Name','Full Address','City','State','5 Digit Zip Code','9 Digit Zip Code','Phone Number','Valid Email']
default_cols_pro=['UID']
vsb1 = Scrollbar(orient="vertical")
text1 = Text(width=40, height=20,yscrollcommand=vsb1.set)
vsb1.config(command=text1.yview)
vsb1.pack(side="right", fill="y")
text1.pack(side="left", fill="both", expand=True)
# end

# sidebaar
sidebar = Frame(root, width=400, bg='#CCC', height=500, borderwidth=2)
sidebar.pack(expand=True, fill='y', side='left', anchor='nw')
sidebar.pack_propagate(0)

# main content area
mainarea = Frame(root, bg='white', width=500, height=500)
mainarea.pack(expand=True, fill='both', side='right')
mainarea.pack_propagate(0)


# Varible List
file_name_uploaded=''
master_file_name=''
processed_file_name=''
output_file_name=''
folder_name=''
var = dict()
var2 = dict()
count=1
# Master data array
datalist=[]
# obfuscated data array
obfuscatdatalist=[]
masterfile=""
encryptedfile=""
filter_array = list()
selected_process_array = list()
ds1=pd.DataFrame()
ds2=pd.DataFrame()
processmasterarray=[]
obfus_or_not = 1

def var_states():
    print(type(var))
    # for x in var:
    #     print(var.get(x).get())
    print(ds1.columns)


def openmasterfile():
   global datalist
   global master_file_name
   global encryptedfile
   global ds1
   global folder_name
   global file_name_uploaded
   master_file_name = askopenfilename()
   
   print(type(masterfile))
   xx['text']=master_file_name
   p=list(map(str.split, open(master_file_name)))
   datalist=np.array(p)
   ds1=pd.read_csv(master_file_name)
   path=os.path.dirname(master_file_name)
   folder_name= os.path.dirname(master_file_name)
   head, tail = os.path.split(master_file_name)
   print(tail)
   file_name_uploaded=str(tail)
   print(ds1.values)
   flag = 0

   if any('UID' in s for s in ds1.columns):
       print('true')
   else:
       ds1 = adduid(ds1)
       
            
   
   
#    print(ds1.columns)
def load_obfus():
    index=0
    global ds2
    for checkBoxName in ds2.columns:
        if checkBoxName in default_cols_pro:
            var2[index]=IntVar(value=1)
        else:
            var2[index]=IntVar() 
        cb = Checkbutton(text=checkBoxName,variable=var2[index],command=selectedprocess)
        text1.window_create("end", window=cb)
        text1.insert("end", "\n")
        index+=1


def obfus_or_not_def():
    if processed_file_name=='':
        return True
    else:
        return False

def Load_Data():
    
    global ds1
    
    index=0
    for checkBoxName in ds1.columns:
        obfu_stat = obfus_or_not_def()
        if obfu_stat:
            if checkBoxName not in default_cols_uid:
                var[index]=IntVar(value=1)
            else:
                var[index]=IntVar()
            
        else:
            if checkBoxName in default_cols:
                var[index]=IntVar(value=1)
            else:
                var[index]=IntVar()

            
            

        
        print(var[index])
        cb = Checkbutton(text=checkBoxName,variable=var[index],command=filter_features)
        text.window_create("end", window=cb)
        text.insert("end", "\n")
        index+=1
    # print(ds1)
    #    print(var.items())
      
    #    var[checkBoxName]=IntVar()
    #    l1=Label(sidebar, text=checkBoxName+" : ")
#            l2=Label(sidebar, text=check)
    #    l1.pack()
#            l2.pack()
           
    #    c = Checkbutton(sidebar, text='',variable=var[checkBoxName],command=var_states)
    #    c.pack()
   

#    for i in range(len(p[0])):
#        for j in range(len(p)):
#


#   Adding unique id
def adduid(ds1):
    ds1.index = pd.Series(([dt.datetime.now().strftime("%Y%m%d%H%M%S")] )* len(ds1))
    ds1['timestamp'] = ds1.index
    ds1.insert(0, 'GUID', range(1,1 + len(ds1)))
    luid=[]
    for index, row in ds1.iterrows():
        row['GUID']="{}-{}".format(str(row['timestamp']),str(row['GUID']))
        luid.append(row['GUID'])
    duid=pd.DataFrame(luid,columns=['UID'])
    ds1.reset_index(drop=True, inplace=True)
    ds1=pd.concat([duid,ds1],axis=1)
    ds1.drop(['GUID','timestamp'], inplace=True, axis=1)
    return ds1


def restart_program():
    """Restarts the current program.
    Note: this function does not return. Any cleanup action (like
    saving data) must be done before calling this function."""
    python = sys.executable
    os.execl(python, python, * sys.argv)



def refresh_data():
    global master_file_name
    global processed_file_name
    global ds1
    global ds2
    global text
    global text1
    master_file_name=''
    processed_file_name=''
    xx['text']=master_file_name
    lencrypt['text']=processed_file_name
    text.delete('1.0', END)
    text1.delete('1.0', END)
    ds1=pd.DataFrame()
    ds2=pd.DataFrame()

    if(len(ds1)!=0 and len(ds2)!=0):
        load_files()
        load_obfus()
    
    # master_file_name=''
    # processed_file_name=''
    # output_file_name=''
    # folder_name=''
    # var = dict()
    # var2 = dict()
    # count=1
    # # Master data array
    # datalist=[]
    # # obfuscated data array
    # obfuscatdatalist=[]
    # masterfile=""
    # encryptedfile=""
    # filter_array = list()
    # selected_process_array = list()
    # ds1=pd.DataFrame()
    # ds2=pd.DataFrame()
    # processmasterarray=[]
    
    messagebox.showinfo("Sucess", "Done")
    # restart_program()



# Filter feature array
def filter_features():
    global var
    global filter_array
    global ds1
    # filter_array.clear()
    if(var):
        for x in var:
            if(var.get(x).get()==1):
                filter_array.append(ds1.columns[x])
    df = pd.DataFrame.from_dict(filter_array)

    print(df)


def selectedprocess():
    global var2
    global selected_process_array
    global ds2
    print(ds2.values)
    # selected_process_array.clear()
    del selected_process_array[:]
    if(var2):
        for x in var2:
            if(var2.get(x).get()==1):
                selected_process_array.append(ds2.columns[x])
    df = pd.DataFrame.from_records(selected_process_array)
    # if(var and (not var2)):
    #     for x in var:
    #         if(var.get(x).get()==1):
    #             selected_process_array.append(ds1.columns[x])
    # df = pd.DataFrame.from_records(selected_process_array)

    print(df)

def defaultSelectedProcess():
    global var2
    global var
    global selected_process_array
    global ds1
    global ds2
    selected_process_array.clear()
    if(var):
        for x in var:
            if(var.get(x).get()==1):
                selected_process_array.add(ds1.columns[x])
    df = pd.DataFrame.from_dict(list(selected_process_array)) 

    print(df)

    
def obfus(df,filterarray,filepath):
    print(filter_array)


    
    ts=str(dt.datetime.now().strftime("%H%M%S"))
    ds=df.filter(filterarray,axis=1)
    ds.to_csv(filepath+'_Obfus'+ts+'.csv',index=False)
    df.to_csv(filepath+'_Master'+ts+'.csv',index=False)
    refresh_data()

    
def click():
    global folder_name
    obfus(ds1,filter_array,r'{}\{}'.format(folder_name,file_name_uploaded))


# Processed + master
def mergedataframe(ds1,ds2,processmasterarray):
    all_columns=set(list(ds1.columns)+list(ds2.columns))
    global filter_array
    global folder_name
    final_df=pd.DataFrame(columns=all_columns)
    print(final_df)
    #print(ds2.columns)
    # ds1.set_index('UID',inplace=True)
    ds1.index=ds1['UID']
    print(ds1.index)
    df=pd.DataFrame(columns=ds1.columns,index=range(len(ds2)))
    print(df)
    fetch_id=list(ds2['UID'])
    #print(fetch_id)
    print('hi')
    print(len(ds2))
    for fet,indi in zip(fetch_id,range(len(ds2))):
        print(ds1.loc[fet])
        df.loc[indi]=ds1.loc[(fet)]
    for i in ds2.columns:
        final_df[i]=ds2[i]
    print("done")
    # final_df

    for i in ds1.columns:
        final_df[i]=df[i]

    print("done")
    final_df.columns
    final_df.isnull().sum()
    
    final_df=final_df.filter(processmasterarray, axis=1)
    final_df.isnull().sum()
    final_df.set_index('UID',inplace=True)
    ts1=str(dt.datetime.now().strftime("%H%M%S"))
    final_df.to_csv(r'{}\output_Final_for_{}'.format(folder_name,file_name_uploaded)+ts1+'.csv',index=True)
    refresh_data()


def precessmaster():
    global selected_process_array
    global filter_array
    global processmasterarray
    global ds1
    global ds2
    in_first = set(selected_process_array)
    in_second = set(filter_array)

    in_second_but_not_in_first = in_second - in_first

    result = selected_process_array + list(in_second_but_not_in_first)
    # processmasterarray=selected_process_array.union(filter_array)
    # print(processmasterarray)
    #processmasterarray.append(filter_array)
    processmasterarray=result
    mergedataframe(ds1,ds2,processmasterarray)


    


   



def openobfuscatedfile():
   global processed_file_name
   global master_file_name
   global encryptedfile
   global ds2
#    global var2
   encryptedfile="hello"
   processed_file_name = askopenfilename()
   
   print(type(processed_file_name))
   
   p=list(map(str.split, open(processed_file_name)))
   datalist=np.array(p)
   ds2=pd.read_csv(processed_file_name)
   print(ds2.values)
   lencrypt['text']=processed_file_name
   
#    global obfuscatdatalist
#    global encryptedfile
#    encryptedfile="hello"
#    encryptedfile = askopenfilename(parent=root)
   
#    print(type(masterfile))
   
#    p=list(map(str.split, open(encryptedfile)))
#    obfuscatdatalist=np.array(p)
#    lencrypt['text']=encryptedfile
#    to create check box
#    for check in datalist:
#        for checkBoxName in datalist[0]:
#            var[checkBoxName]=IntVar()
#            l1=Label(mainarea, text=checkBoxName+" : ")
#            l2=Label(mainarea, text=check)
#            l1.pack()
#            l2.pack()
           
#            c = Checkbutton(mainarea, text='',variable=var[checkBoxName],command=var_states)
#            c.pack()
   

#    for i in range(len(p[0])):
#        for j in range(len(p)):
   
#    print(datalist)








# def var_states():
   #print(p)
#    global datalist
#    for checkBoxName in var:
#        l1=Label(mainarea, text=checkBoxName)
#        l=Label(mainarea, text=var.get(checkBoxName).get())
#    l1.pack()
#    l.pack()
#    print(datalist[0][0])
#    print(checkBoxName)



menubar = Menu(root)
filemenu = Menu(menubar, tearoff=0)
filemenu.add_command(label="Import Master", command=openmasterfile)
filemenu.add_command(label="Import Processed", command=openobfuscatedfile)

filemenu.add_command(label="Export", command=openmasterfile)
filemenu.add_separator()
filemenu.add_command(label="Exit", command=root.quit)
menubar.add_cascade(label="File", menu=filemenu)

root.config(menu=menubar)






def make_label(master, x, y, h, w, *args, **kwargs):
    f = Frame(master, height=h, width=w)
    f.pack_propagate(0) # don't shrink
    f.place(x=x, y=y)
    label = Label(f, *args, **kwargs)
    label.pack(fill=BOTH, expand=1)
    return label
make_label(menubar, 8, 10, 11, 30, text='File')


def make_button(master, x, y, h, w, *args, **kwargs):
    f = Frame(master, height=h, width=w)
    f.pack_propagate(0) # don't shrink
    f.place(x=x, y=y)
    button = Button(f, *args, **kwargs)
    button.pack(fill=BOTH, expand=1)
    return button
def make_checkbox(master, x, y, h, w, n, **kwargs):
    f = Frame(master, height=h, width=w)
    f.pack_propagate(0) # don't shrink
    f.place(x=x, y=y)

    c=Checkbutton(sidebar, text=n,variable=obfus_or_not,command=filter_features)
    c.pack(fill=BOTH, expand=1)
    return c
   
def addCheckBox():
    global count
    
    checkBoxName = "".join(random.choice(string.letters) for _ in range(10))
    
    var[checkBoxName]=IntVar()
    
    c=Checkbutton(sidebar, text=checkBoxName,variable=var[checkBoxName],command=filter_features)
    
    count=count+1
    c.pack()



# update scrollregion after starting 'mainloop'
# when all widgets are in canvas
# canvas.bind('<Configure>', on_configure)

# --- put frame in canvas ---

def load_files_deobfus():
    
    Load_Data()
    load_obfus()
    filter_features()
    selectedprocess()

def load_files():
    
    Load_Data()
    load_obfus()
    filter_features()
    selectedprocess()
    
    #openmasterfile()
    #openobfuscatedfile()
    # pass




for checkBoxName in datalist:
    var[checkBoxName]=IntVar()
     
    c = Checkbutton(sidebar, text=checkBoxName,variable=var[checkBoxName],command=var_states)
    c.pack()


make_label(header, 8, 10, 25, 90, text='Master')
make_label(header, 8, 39, 25, 90, text='Processed')
xx=make_label(header, 98, 10, 25, 680, text=masterfile,bg='white')
lencrypt=make_label(header, 98, 39, 25, 680, text=encryptedfile,bg='white')
make_button(header,750,12,22,22,text="...", command=openmasterfile)
make_button(header,750,41,22,22,text="...", command=openobfuscatedfile)
# make_checkbox(header,100,70,27,70,'obfusticator')
make_button(header,200,70,27,70,text="Load", command=load_files)
make_button(header,280,70,27,90,text="Load deobfus", command=load_files_deobfus)
make_button(header,710,70,27,70,text="Obfus", command=click)
#make_button(header,600,70,27,70,text="de Obfus", command=precessmaster)
make_button(header,600,70,27,70,text="De Obfus", command=precessmaster)
CheckVar = IntVar()
checkbutton = Checkbutton(root, text = "Test", variable = CheckVar,command=selectedprocess)
checkbutton.select()




b1=Button(menubar, text="Add a checkbox", command=addCheckBox)
b1.pack(side=LEFT)
b=Button(menubar, text='Show', command=var_states)
b.pack(side=LEFT)


root.mainloop()
