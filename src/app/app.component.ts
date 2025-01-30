import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { jsPDF } from 'jspdf';
import { CommonModule, DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DatePipe],
})
export class AppComponent implements OnInit {
  values: any = [];
  dataprestas: any = [];
  prestas: any = [
    {
      nom: 'Frais de déplacement Jour-J (Aller/Retour)',
      en: 'D-Day Travel Expenses (Round Trip)',
      prix: 0.4,
      kilorly: true,
    },
    {
      nom: 'Frais de déplacement Essai (Aller/Retour)',
      en: 'Trial Travel Expenses (Round Trip)',
      prix: 0.4,
      kilorly: true,
    },
    {
      nom: 'Frais de déplacement renfort (Aller/Retour)',
      en: 'Backup Travel Expenses (Round Trip)',
      prix: 0.4,
      kilorly: true,
    },
    {
      nom: 'Mariée (essai et jour-J)',
      en: 'Bride (Trial and D-Day)',
      titre: true,
    },
    {
      nom: 'Forfait Mariée Complet',
      en: 'Complete Bride Package',
      prix: 420,
      onlyOne: true,
      bride: true,
    },
    {
      nom: 'Maquillage Mariée',
      en: 'Bride Makeup',
      prix: 220,
      onlyOne: true,
      bride: true,
    },
    {
      nom: 'Coiffure Mariée',
      en: 'Bride Hairstyling',
      prix: 220,
      onlyOne: true,
      bride: true,
    },
    {
      nom: 'Maquillage et coiffure supplémentaire (Mariage civil, seconde mise en beauté)',
      en: 'Additional Makeup and Hairstyling (Civil Wedding, Second Beauty Touch-Up)',
      prix: 300,
      bride: true,
    },
    {
      nom: 'Invitée (jour-J)',
      en: 'Guest (D-Day)',
      titre: true,
    },
    {
      nom: 'Forfait Invitée Complet',
      en: 'Complete Guest Package',
      prix: 130,
    },
    {
      nom: 'Coiffure Invitée (Attache complète)',
      en: 'Guest Hairstyling (Full Updo)',
      prix: 80,
    },
    {
      nom: 'Coiffure Invitée (Attache partielle)',
      en: 'Guest Hairstyling (Partial Updo)',
      prix: 70,
    },
    {
      nom: 'Brushing Hollywoodien Invitée',
      en: 'Hollywood Blowout (Guest)',
      prix: 70,
    },
    {
      nom: 'Maquillage Invitée',
      en: 'Guest Makeup',
      prix: 65,
    },
    {
      nom: 'Coiffure enfant (-13ans)',
      en: 'Child Hairstyling (-13 years)',
      prix: 30,
    },
    {
      nom: 'Options',
      en: 'Options',
      titre: true,
    },
    {
      nom: 'Pose Faux-cils',
      en: 'False Lashes Application',
      prix: 10,
    },
    {
      nom: 'Pose Faux-cils (bouquets)',
      en: 'False Lashes Application (Clusters)',
      prix: 0,
    },
    {
      nom: 'Maquillage Marié',
      en: 'Groom Makeup',
      prix: 30,
      onlyOne: true,
    },
    {
      nom: 'Présence avant 7h',
      en: 'Early Presence (Before 7 AM)',
      prix: 30,
      onlyOne: true,
    },
    {
      nom: 'Suivi Mariée',
      en: 'Bride Follow-Up',
      prix: 50,
      hourly: true,
    },
  ];

  typeinvitee = ["Invitée","Mariée"]

  collegues = [
    ["Cloé","CHAUDRON","06.68.64.44.02","cloe.chaudron@outlook.com"],
    ["Celma","SAHIDET","06.80.84.42.52","sahidetcelma@gmail.com"]
  ]

  invitees:any = [[0,"8h30","8h45","9h00","9h00","10h15","15h30 à 16h00","jusqu'à 16h00","16h00",0]];

  planningtop = [{
    fr:"ARRIVEE"
  },{
    fr:"INSTALLATION"
  },{fr:"MAQUILLAGE"},{fr:"COIFFURE"},{fr:"FIN PRESTATION"},{fr:"RETOUCHES"},{fr:"DISPONIBILITE"},{fr:"CEREMONIE"}]

  lg = 'Français';

  mode = 'devis';
  public innerWidth: any = window.innerWidth;
  public innerHeight: any = window.innerHeight;
  paysage = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerHeight = event.target.innerHeight;
    this.innerWidth = event.target.innerWidth;

    if (event.target.innerHeight > event.target.innerWidth)
      this.paysage = false;
    else this.paysage = true;
  }

  constructor(private datePipe: DatePipe, private http: HttpClient) {
    if(isDevMode())this.mode="planning";
    const now = new Date();
    let twoweeks = new Date();
    twoweeks = new Date(twoweeks.getTime() + 14 * 24 * 60 * 60 * 1000);
    let sixmonth = new Date();
    sixmonth = new Date(sixmonth.getTime() + 30 * 24 * 6 * 60 * 60 * 1000);
    this.values[0] = this.datePipe.transform(now, 'dd/MM/yyyy') || '';
    this.values[1] = '1';
    this.values[2] = this.datePipe.transform(now, 'yyyy') || '';
    this.values[3] = 'Cloé Chaudron';
    this.values[5] = '126 Rue de la Cerisaie';
    this.values[7] = '84400 Gargas';
    this.values[9] = '06.68.64.44.02';
    this.values[11] = 'cloe.chaudron@outlook.com';
    this.values[13] = this.datePipe.transform(twoweeks, 'dd/MM/yyyy') || '';
    this.values[14] = this.datePipe.transform(sixmonth, 'dd/MM/yyyy') || '';
    this.values[15] = '';
    this.values[16] = 'Virement';
    this.values[50] = "PLANNING";
    this.values[51] = this.datePipe.transform(sixmonth, 'dd/MM/yyyy') || '';
    this.values[52] = "";
    this.values[53] = "";
    this.values[54] = "";

    this.prestas.forEach((presta: any) => {
      presta.qte = 0;
    });
  }

  ngOnInit() {
    if (this.innerHeight > this.innerWidth) this.paysage = false;
    else this.paysage = true;
    //this.getDevis();
  }

  checkRow(row: number, col: number, c:number): number {
    let tab = this.getInvitees(c);

    const value = tab[row][col];
    let count = 1;
    
    for (let i = row + 1; i < tab.length; i++) {
        if (value != "" && tab[i][col] === value) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

calculate()
{
  this.invitees.sort((a:any,b:any)=>{return (this.toDate(a[5]) - this.toDate(b[5]))});
}

addInvitee()
{
  this.calculate();
  

  this.invitees.push([
    0,
    "",
    "",
    this.invitees.length>0?this.invitees[this.invitees.length-1][5]:"",
    this.invitees.length>0?this.invitees[this.invitees.length-1][5]:"",
    this.invitees.length>0?this.addMinutesToTime(this.invitees[this.invitees.length-1][5],75):"",
    this.invitees.length>0?this.invitees[this.invitees.length-1][6]:"",
    this.invitees.length>0?this.invitees[this.invitees.length-1][7]:"",
    this.invitees.length>0?this.invitees[this.invitees.length-1][8]:"",
    this.invitees.length>0?this.invitees[this.invitees.length-1][9]:0
  ]);
}

getInvitees(c:any)
{
  return this.invitees.filter((i:any)=>i[9]==c);
}

trackByIndex(index: number, item: any): number {
  return index;
}

getNbInvitee(c:number, i:number, t:any)
{
  let tab = this.getInvitees(c);
  let count = 1;
  for(let x=0;x<i;x++)
  {
    if(tab[x][0]==t)count++;
  }
  return count;
}

changetypeinvitee(i:number)
{
  let invitee = this.invitees[i];
  if(invitee[0]==1)
  {
    if(invitee[3]!=""&&invitee[4]!="")invitee[5]=this.addMinutesToTime(invitee[3],120);
    else if(invitee[3]!="")invitee[5]=this.addMinutesToTime(invitee[3],60);
    else if(invitee[4]!="")invitee[5]=this.addMinutesToTime(invitee[4],60);
  }
  else if(invitee[0]==0)
  {
    if(invitee[3]!=""&&invitee[4]!="")invitee[5]=this.addMinutesToTime(invitee[3],75);
    else if(invitee[3]!="")invitee[5]=this.addMinutesToTime(invitee[3],45);
    else if(invitee[4]!="")invitee[5]=this.addMinutesToTime(invitee[4],45);
  }
}

toDate(time:string):any
{
  let [hours, minutes] = time.split("h").map(Number);

  // Créer un objet Date avec l'heure et les minutes
  let date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return date;
}

addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  // Extraire l'heure et les minutes depuis le format "HHhMM"
  let [hours, minutes] = timeStr.split("h").map(Number);

  // Créer un objet Date avec l'heure et les minutes
  let date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);

  // Récupérer la nouvelle heure et minutes
  let newHours = date.getHours();
  let newMinutes = date.getMinutes();

  let retour = newHours + 'h' +(newMinutes<10?newMinutes+'0':newMinutes);

  // Formater en "HHhMM" (ajout d'un zéro si besoin)
  return retour;
}

deleteInvitee(i:any)
{
  this.invitees.splice(i,1);

  this.calculate();
}

checkCol(row: number, col: number, c:number): number {
  let tab = this.getInvitees(c);

  const value = tab[row][col];
  let count = 1;
  
  for (let i = col + 1; i < tab[row].length; i++) {
      if (value != "" && tab[row][i] === value) {
          count++;
      } else {
          break;
      }
  }

  return count;
}

checkDisplay(row: number, col: number, c:number) {
  let tab = this.getInvitees(c);

  const value = tab[row][col];
  if(value != "" && tab[row][col-1]===value) return true;
  if(row>0&&value != "" && tab[row-1][col]===value) return true;
  else return false;
}

  generatePDFfromHTML() {
    const element = document.getElementById('htmlContent');

    html2canvas(element!, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // Largeur en mm pour A4
      const pageHeight = 297; // Hauteur pour A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      let nom = 'DEVIS_';
      if (this.mode == 'facture') nom = 'FACTURE_';
      if (this.mode == 'planning')
      {
        nom = 'PLANNING_'+this.values[51];
      }
      else
      {
        if (this.values[1] < 100) nom = nom + '0';
        if (this.values[1] < 10) nom = nom + '0';
        nom = nom + this.values[1];
        nom = nom + '_' + this.values[2];
      }

      pdf.save(nom + '.pdf');
      //this.trackVisit();
    });
  }

  addCollegue()
  {
    this.collegues.push(["","","",""]);
  }

  addPresta() {
    this.prestas.push({ nom: '', qte: 0, prix: 50, reduc: '' });
  }

  calc(presta: any) {
    let prix = presta.prix * presta.qte;
    if (presta.reduc) prix = prix - (prix * presta.reduc) / 100;
    if (presta.kilorly && presta.qte < 11) prix = 0;
    return Math.floor(prix);
  }

  calcTot(calcDeja: boolean = false) {
    let prix = 0;
    this.prestas
      .filter((presta: any) => presta.qte > 0)
      .forEach((presta: any) => {
        prix += this.calc(presta);
      });
    if (calcDeja && this.values[15] != '') prix = prix - this.values[15];
    return Math.floor(prix);
  }

  calcares() {
    let prix = 0;
    this.prestas
      .filter((presta: any) => presta.bride && presta.qte > 0)
      .forEach((presta: any) => {
        prix += this.calc(presta);
      });
    if (prix != 0) prix = 0.3 * prix;
    return Math.floor(prix);
  }

  getDevis() {
    this.http
      .get<any>(
        'http' +
          (isDevMode() ? '' : 's') +
          '://chiyanh.cluster031.hosting.ovh.net/devisget'
      )
      .subscribe((data) => {
        this.values[1] = data.num;
      });
  }

  formatDate(dateStr: any) {
    const [day, month, year] = dateStr.split('/'); // Sépare le format dd/mm/yyyy
    return this.lg === 'Anglais' ? `${month}/${day}/${year}` : dateStr;
  }

  trackVisit() {
    const dataToSend = {
      num: this.values[1] + 1,
    };
    from(
      fetch(
        'http' +
          (isDevMode() ? '' : 's') +
          '://chiyanh.cluster031.hosting.ovh.net/devisset',
        {
          body: JSON.stringify(dataToSend),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          mode: 'no-cors',
        }
      )
    ).subscribe((data: any) => {});
  }
}
