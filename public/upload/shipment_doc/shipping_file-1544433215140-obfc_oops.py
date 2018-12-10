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

from tkinter.filedialog import askopenfilename
masterfile=""
encryptedfile=""
var = dict()
var1 = dict()
check_list=[]
check_list_process=[]
ds1=pd.DataFrame()
ds2=pd.DataFrame()



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


# menu bar
menubar = Menu(root)
filemenu = Menu(menubar, tearoff=0)
filemenu.add_command(label="Import Master")
filemenu.add_command(label="Import Processed")

filemenu.add_command(label="Export")
filemenu.add_separator()
filemenu.add_command(label="Exit", command=root.quit)
menubar.add_cascade(label="File", menu=filemenu)

root.config(menu=menubar)
# 
# make Label
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

    c=Checkbutton(master, text=n,variable=obfus_or_not,command=filter_features)
    c.pack(fill=BOTH, expand=1)
    return c
   
def addCheckBox():
    global count
    
    checkBoxName = "".join(random.choice(string.letters) for _ in range(10))
    
    var[checkBoxName]=IntVar()
    
    c=Checkbutton(sidebar, text=checkBoxName,variable=var[checkBoxName],command=filter_features)
    
    count=count+1
    c.pack()






# refresh data
def refresh_data():
    global master_file_name
    global processed_file_name
    global ds1
    global ds2
    global text
    global text1
    master_file_name=''
    processed_file_name=''
   
    text.delete('1.0', END)
    text1.delete('1.0', END)
    ds1=pd.DataFrame()
    ds2=pd.DataFrame()

# open obfus


def openprocessedfile():
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
   

    

# open master

def openmasterfile():
   global var
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
#    for checkBoxName in ds1.columns:
#        var[checkBoxName]=IntVar()
#        c = Checkbutton(text, text=checkBoxName,variable=var[checkBoxName],command=var_states)
#        c.pack()

   if any('UID' in s for s in ds1.columns):
       print('true')
   else:
       ds1 = adduid(ds1)
       


def var_states():
    global var
    for x in var:
        print(var.get(x).get())
        
def var_states2():
    global var1
    for x in var1:
        print(var1.get(x).get())


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


def load_master_checkbox():
   
    index=0
    global var
    global ds1
  
    for checkBoxName in ds1.columns:
        if checkBoxName in default_cols_pro:
            var[index]=IntVar(value=1)
        else:
            var[index]=IntVar() 
        cb = Checkbutton(text=checkBoxName,variable=var[index],command=var_states)
        text.window_create("end", window=cb)
        text.insert("end", "\n")
        index+=1


def laod_process_checkbox():
    index_obfus = 0
    global var1
    global ds2
    for checkBoxName in ds2.columns:
        if checkBoxName in default_cols_pro:
            var1[index_obfus]=IntVar(value=1)
        else:
            var1[index_obfus]=IntVar() 
        cb = Checkbutton(text=checkBoxName,variable=var1[index_obfus],command=var_states2)
        text1.window_create("end", window=cb)
        text1.insert("end", "\n")
        index_obfus+=1

def load_checkbox():
    global ds2
    load_master_checkbox()
    if(ds2.size):
        laod_process_checkbox()
        print("ds2 check box loaded")





def Save_Csv(df,name):

    df.to_csv(r'{}\{}_Final'.format(folder_name,file_name_uploaded)+ts1+'.csv',index=False)




def Ob_t():
    df=pd.read_csv(r"C:\Users\sooryaprakash\Desktop\dsm -ai\combined_f1_f2_f3.csv")
    df.insert(0, 'UID', range(1,1 + len(df)))
    print(df.columns)
    var_mas = [1,0,1,1,0,1,1,1,0,1,1,1,1,0,0,0,1,0,0]
    df_col2=[]
    for index, x in var_mas:
        if x is 1:
            df_col2.append(df.columns[index])
    ds2 = df[df_col2]
    print(ds2.columns)
    print(var_mas)

def Obfuscicate(var_mas,ds1):
    print(var_mas)
    print('Inside Obfus')
    df_col1=[]
    
    for index, x in enumerate(list(var_mas)):
        if x is 1:
            print(x)
    return

def De_Obfuscicate(var_mas,var_pro,ds1,ds2):

    
    # print("ds1",ds1)
    # print("ds2",ds2)
    # print("Master selected",var_mas)
    # print("Selected process",var_pro)

    df_col1=[]
    for index, x in enumerate(var_mas):
        if x is 1:
            df_col1.append(ds1.columns[index])
    df1 = ds1[df_col1]
    print(df1)

    df_col2=[]
    for index, x in enumerate(var_mas):
        if x is 1:
            df_col2.append(ds2.columns[index])
    df2 = ds2[df_col2]
   
    print(df2)


    print(df1.columns)
    print(df2.columns)
    all_columns=set(list(df1.columns)+list(df2.columns))
    final_df=pd.DataFrame(columns=all_columns)
    # df1.set_index('UID',inplace=True)
    df1.index=df1['UID']
    print(df1.index)
    df=pd.DataFrame(columns=df1.columns,index=range(len(ds2)))




    fetch_id=list(df2['UID'])
    for fet,indi in zip(fetch_id,range(len(df2))):
        df.loc[indi]=df1.loc[fet]
        
        
    for i in df2.columns:
        final_df[i]=df2[i]
    print("done")

    for i in df1.columns:
        final_df[i]=df[i]
    print("done")
    final_df.columns

    df = final_df
    # print(folder_name)
    ts1=str(dt.datetime.now().strftime("%H%M%S"))
    final_df.to_csv(r'{}\{}_Final'.format(folder_name,file_name_uploaded)+ts1+'.csv',index=False)
    return df

def Obc_But():
    global var
    global ds1
    # global check_list
    # del check_list[:]
    # for val in var:
    #     print()
    #     check_list.append(var.get(val).get())
    # print("Check LISt")
    # print(check_list)


    # var_mas = var


# check list
def dictToList():
    global var
    global ds1
    global check_list
    del check_list[:]
    for val in var:
        print()
        check_list.append(var.get(val).get())
    return check_list


# var2
def dictToListProcess():
    global var1
    global ds1
    global check_list_process
    del check_list_process[:]
    for val in var1:
        print()
        check_list_process.append(var.get(val).get())
    return check_list_process

    

# Obfuscicate(var,ds1)

def DeObc_But():
    global ds1
    global ds2
    global var
    global var1
    De_Obfuscicate(var,var1,ds1,ds2)
    print("De Obfus")



    # cd ..
    # De_Obfuscicate(var_mas,var_pro,ds1,ds2)

   


make_label(header, 8, 10, 25, 90, text='Master')
make_label(header, 8, 39, 25, 90, text='Processed')
xx=make_label(header, 98, 10, 25, 680, text=masterfile,bg='white')
lencrypt=make_label(header, 98, 39, 25, 680, text=encryptedfile,bg='white')
make_button(header,750,12,22,22,text="...",command=openmasterfile)
make_button(header,750,41,22,22,text="...",command=openprocessedfile)
# make_checkbox(header,100,70,27,70,'obfusticator')
# make_button(header,200,70,27,70,text="Load obfus",command=load_master_checkbox)
make_button(header,280,70,27,90,text="Load",command=load_checkbox)
make_button(header,710,70,27,70,text="Obfus", command=Obc_But)
#make_button(header,600,70,27,70,text="de Obfus", command=precessmaster)
make_button(header,600,70,27,70,text="De Obfus", command=DeObc_But)
CheckVar = IntVar()
checkbutton = Checkbutton(root, text = "Test", variable = CheckVar)
checkbutton.select()







root.mainloop()
