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
with open('./data/imdb_data.json') as json_file:
    data = json.load(json_file)
    a = 0
    for item in data:
        a = a + 1
        #print(item['Plot'])
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
        del item['Type']
        del item['Released']
        item['Genre'] = item['Genre'].partition(' ')[0]
        if item['Genre'][-1] == ',':
            item['Genre'] = item['Genre'][:-1]
        ## FIX YEAR THAT HAS A SPAN


print('Processed ' + str(a) + ' movies')
data.sort(key=extract_rating, reverse=True)
strippedData = data[0:100]


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

#print(extraInfo)

numbMatches = 0
for entries in strippedData:
    currentID = entries['imdbID']
    entries['bechdel'] = '-1'
    #print(entries)
    for items in extraInfo['movies']:
        matchingID = items['imdbID']
        if matchingID == currentID:
            #print("MATCH")
            numbMatches = numbMatches + 1
            entries['bechdel'] = items['bechdel']
            entries['income'] = items['income']
        else:
            entries['income'] = '-1'

#print(numbMatches)


with open('processedData.json', 'w', encoding='utf-8') as f:
    json.dump(strippedData, f, ensure_ascii=False, indent=4)
print("Writing to file processedData.json")    
print("\n ########## DONE PROCESSING ##########")
 

##### FORMAT THE NEW PROCESSED DATA ACCORDING TO VISUALIZATION
