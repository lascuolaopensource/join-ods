import {Injectable} from "@angular/core";
import {
  FablabMachine,
  FablabQuotation,
  FablabReservation,
  FablabReservationTime,
  FablabService,
  SlimMachine,
  UserContacts
} from '@sos/sos-ui-shared';
import {Observable} from "rxjs/Observable";
import {StatsTrend} from "../stats-shared";


export interface FablabMachineStat {
  id: number
  name: string
  usage: number
  trend: StatsTrend
}

export interface FablabStatCount {
  quotations: number
  reservations: number
  machines: number
}

export interface FablabReservationFlat {
  id: number
  user: UserContacts
  machine: SlimMachine
  time: FablabReservationTime
  operator: boolean
}


@Injectable()
export class AdminFablabService extends FablabService {

  public reservationsByDate(from: Date, to: Date): Observable<FablabReservationFlat[]> {
    const fromT = from.getTime() - (from.getTimezoneOffset() * 60 * 1000);
    const toT = to.getTime() - (to.getTimezoneOffset() * 60 * 1000);
    const url = `${this.backendUrl}/fablab/reservations/by_date?from=${fromT}&to=${toT}`;
    return this.http.get(url, this.options)
      .map(response => response.json().reservations.map(r => {
        r.time.date = new Date(r.time.date);
        return r;
      }));
  }

  public deleteReservationTime(id: number, machineId: number, date: Date, hour: number): Observable<void> {
    const payload = { machineId, date: date.getTime(), hour };
    const url = `${this.backendUrl}/fablab/reservations/${id}/delete_time`;
    return this.http.put(url, payload, this.options).map(() => {});
  }

  public createMachine(machine: FablabMachine): Observable<FablabMachine> {
    return this.http.post(`${this.backendUrl}/fablab/machines`, machine, this.options)
      .map(response => response.json());
  }

  public updateMachine(machine: FablabMachine): Observable<FablabMachine> {
    return this.http.put(`${this.backendUrl}/fablab/machines/${machine.id}`, machine, this.options)
      .map(response => response.json());
  }

  public deleteMachine(id: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/fablab/machines/${id}`, this.options)
      .map(() => {});
  }


  public allQuotations(): Observable<FablabQuotation[]> {
    return this.http.get(`${this.backendUrl}/fablab/quotations`, this.options)
      .map(response => response.json().quotations.map(FablabQuotation.fromJson));
  }

  public deleteQuotation(id: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/fablab/quotations/${id}`, this.options)
      .map(() => {});
  }

  public updateUndertakenQuotation(id: number, undertaken: boolean): Observable<void> {
    let url = `${this.backendUrl}/fablab/quotations/${id}`;
    if (undertaken)
      url += '?undertaken';
    return this.http.put(url, this.options).map(() => {});
  }

  public otherUserReservations(userId: number, future: boolean = false): Observable<FablabReservation[]> {
    let qs = future ? '?future=true' : '';
    return this.http.get(`${this.backendUrl}/fablab/reservations/user/${userId}${qs}`, this.options)
      .map(response => response.json().reservations.map(FablabReservation.fromJson));
  }

  private getStatsUrl(path: string, from: Date, to: Date): string {
    return `${this.backendUrl}/fablab/stats/${path}?from=${from.getTime()}&to=${to.getTime()}`;
  }

  public topMachinesByUsage(from: Date, to: Date): Observable<FablabMachineStat[]> {
    return this.http.get(this.getStatsUrl('top_machines', from, to), this.options)
      .map(response => response.json().stats);
  }

  public count(from: Date, to: Date): Observable<FablabStatCount> {
    return this.http.get(this.getStatsUrl('count', from, to), this.options)
      .map(response => response.json().stats);
  }

}
