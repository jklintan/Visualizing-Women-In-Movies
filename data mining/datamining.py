## Script for combining movie dataset with bechdel data

import json
import csv

# Sort by rating, turn N/A into 0 for sorting purposes
def extract_rating(json):
    try:
        if json['imdbRating'] == 'N/A':
            json['imdbRating'] = -1
        return float(json['imdbRating'])
    except KeyError:
        return 0


print('########## PROCESSING MOVIE DATABASES ########### \n')

## Read in json file with 5000 imdb movies ##
data = {}
cleanData = list()
with open('./data/imdb_data.json') as json_file:
    data = json.load(json_file)
    a = 0
    for item in data:
        a = a + 1
        
        if 'Type' not in item:
            continue
           
        if 'Plot' not in item:
            print("No plot, erasing item")
            continue
        else:
            del item['Plot']
    
        del item['Rated']
        del item['Poster']
        del item['Runtime']
        del item['Actors']
        del item['Response']
        del item['Language']
        del item['Country']
        #del item['imdbRating']
        del item['imdbVotes']
        del item['Metascore']
        #del item['Type']
        del item['Released']
        item['Genre'] = item['Genre'].partition(' ')[0]
        if item['Genre'][-1] == ',':
            item['Genre'] = item['Genre'][:-1]
        
        #Fix years that have a span
        if len(item['Year']) > 4:
            item['Year'] = item['Year'][:4]

        if int(item['Year']) < 1970:
            continue
        
        item['PosterImage'] = item['imdbID'] + '.jpg'
        filePath = './data/images/' + item['PosterImage']
        try:
            f = open(filePath)
        except IOError:
            item['PosterImage'] = 'N/A'

        if item['Type'] != 'movie':
            continue
        else:
            cleanData.append(item)
                

print('Processed ' + str(a) + ' movies')
cleanData.sort(key=extract_rating, reverse=True)
ITEMS = 100
strippedData = cleanData[0:ITEMS]
print('Choosing top ' + str(ITEMS) + ' after imdb score')

images = 0
uniqueID = 1
genres = list()
for item in strippedData:
    item['id'] = uniqueID
    uniqueID = uniqueID + 1
    if item['Genre'] in genres:
        genresID = 0
    else:
        genres.append(item['Genre'])
    if item['PosterImage'] != 'N/A':
        images = images + 1

print('Movie posters exists for ' + str(images) + ' movies out of ' + str(ITEMS))
genres.sort()
#print(genres)

## Read in csv file with bechdel test datawith open('employee_birthday.txt') as csv_file:
with open('./data/bechdel.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    extraInfo = {}
    extraInfo['movies'] = []
    for row in csv_reader:
        if line_count == 0:
            line_count += 1
        else:
            bechdelPass = row[5]
            if bechdelPass == 'PASS':
                passingInfo = 1
            else:
                passingInfo = 0

            extraInfo['movies'].append({'bechdel': passingInfo, 'imdbID': row[1], 'income': row[8]})
            line_count += 1
    print(f'Processed {line_count} lines of bechdel test info')

numbMatches = 0
noInfo = 0
for entries in strippedData:
    currentID = entries['imdbID']
    #print(entries)
    for items in extraInfo['movies']:
        matchingID = items['imdbID']
        entries['income'] = '-1'
        entries['bechdel'] = 'N/A'
        if matchingID == currentID:
            #print("MATCH")
            numbMatches = numbMatches + 1
            entries['bechdel'] = items['bechdel']
            entries['income'] = items['income']
            break
        else:

            noInfo = noInfo + 1

#print(numbMatches)

print('Bechdel info exists for ' + str(numbMatches) + ' of ' + str(ITEMS) + ' items')
strippedData = sorted(strippedData, key=lambda k: k['Genre'])

##### FORMAT THE NEW PROCESSED DATA ACCORDING TO VISUALIZATION HIERARCHY

processedData = dict()
processedData['id'] = 1
processedData['name'] = 'Movies'


childrenData = dict()
genreData = dict()
tempData = dict()

genreID = 0
first = 0
listAllGenres = list()
k = 0

##Genres and statistics
print("\n** STATISTICS OVER CHOSEN MOVIES **\n")

for genre in genres:
    listGenre = list()
    for items in strippedData:
        if items['Genre'] == genres[genreID]:
            listGenre.append(items)
            k = k + 1
    genreID = genreID + 1
    listAllGenres.append(listGenre)
    stars = ""
    for i in range(1,k):
        stars = stars + "*"
    print(genre + "(" + str(k-1) + "): " + stars)
    k = 1

genreID = 0
templist = dict()
fullList = list()
for allgenres in listAllGenres:
    templist = dict()
    templist['id'] = genreID + 1
    templist['name'] = genres[genreID]
    templist['children'] = allgenres
    genreID = genreID + 1
    fullList.append(templist)

processedData['children'] = fullList

with open('processedData.json', 'w', encoding='utf-8') as f:
    json.dump(processedData, f, ensure_ascii=False, indent=4)

print("\nWriting to file processedData.json")    
print("\n########### DONE PROCESSING ###########")

