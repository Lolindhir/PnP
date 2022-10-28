export class SpellSource{

    public static CategoryOfficialCore: string[] = ['Player', 'Xanathar', 'Tasha'];
    public static CategoryOfficialOther: string[] = ['Official', 'Unearthed', 'Wildemount', 'Fizban', 'Strixhaven'];

    public static GetAbbreviation(source: string) : string{
        var sourceAbb : string = source;

        //shorten sources
        if(source.includes('Player')){
            sourceAbb = 'PHB'
        }
        else if(source.includes('Xanathar')){
            sourceAbb = 'XGtE'
        }
        else if(source.includes('Tasha')){
            sourceAbb = 'TCoE'
        }
        else if(source.includes('Official')){
            sourceAbb = 'Adventure'
        }
        else if(source.includes('Unearthed')){
            sourceAbb = 'UA'
        }
        else if(source.includes('Wildemount')){
            sourceAbb = 'Wildemount'
        }
        else if(source.includes('Fizban')){
            sourceAbb = 'Fizban'
        }
        else if(source.includes('Strixhaven')){
            sourceAbb = 'Strixhaven'
        }
        else if(source.includes('Homebrew')){
            sourceAbb = 'Homebrew'
        }
        else if(source.includes('Kibbles')){
            sourceAbb = 'Kibbles'
        }
        else if(source.includes('MCDM')){
            sourceAbb = 'MCDM'
        }

        //add changed
        if(source.toLowerCase().includes('changed')){
            sourceAbb += ' (changed)'
        }

        return sourceAbb;
    }

}