import datetime


def myscript():
    ref = []
    for i in range(5):
        ref.append(str(datetime.datetime.now())+' - '+str(i))
    return ref


if __name__ == '__main__':
    ref = myscript()
    print(ref)


